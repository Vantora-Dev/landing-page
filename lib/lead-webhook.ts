import { site } from "./site";

/**
 * Shapes a lead for whichever service `LEAD_WEBHOOK_URL` points at.
 *
 * This is separate from the route so it can be tested directly: a
 * Slack-shaped body posted to Discord is rejected outright, and a rejected
 * delivery is a lost enquiry, so the shaping is worth verifying without
 * standing up a server.
 */

export type Lead = {
  name: string;
  email: string;
  phone: string;
  business: string;
  location: string;
  message: string;
};

/** Signal amber (#fbbf24) as the integer Discord expects for an embed colour. */
const DISCORD_COLOUR = 0xfbbf24;

/** Discord's documented caps. Exceeding any of them fails the whole delivery. */
const DISCORD_LIMITS = { title: 256, fieldValue: 1024, content: 2000 };

function clamp(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

export function isDiscord(url: string): boolean {
  return /^https:\/\/(?:ptb\.|canary\.)?discord(?:app)?\.com\/api\/(?:v\d+\/)?webhooks\//i.test(
    url,
  );
}

export function isSlack(url: string): boolean {
  return /^https:\/\/hooks\.slack\.com\//i.test(url);
}

export function buildSummary(lead: Lead): string {
  const note = clamp(lead.message, 1200);

  return [
    `New enquiry — ${lead.business}`,
    `${lead.name} · ${lead.location}`,
    `${lead.email} · ${lead.phone}`,
    note ? `\n"${note}"` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Discord rejects payloads containing keys it doesn't recognise, so it gets a
 * body built to its own contract rather than the generic one. An embed also
 * reads far better than a wall of text when you're trying to act on a lead.
 */
export function discordPayload(lead: Lead) {
  const fields: Array<{ name: string; value: string; inline: boolean }> = [
    { name: "Name", value: clamp(lead.name, DISCORD_LIMITS.fieldValue), inline: true },
    { name: "Phone", value: clamp(lead.phone, DISCORD_LIMITS.fieldValue), inline: true },
    { name: "Email", value: clamp(lead.email, DISCORD_LIMITS.fieldValue), inline: true },
    {
      name: "Location",
      value: clamp(lead.location, DISCORD_LIMITS.fieldValue),
      inline: true,
    },
  ];

  if (lead.message) {
    fields.push({
      name: "Notes",
      value: clamp(lead.message, DISCORD_LIMITS.fieldValue),
      inline: false,
    });
  }

  return {
    username: site.name,
    embeds: [
      {
        title: clamp(`New enquiry — ${lead.business}`, DISCORD_LIMITS.title),
        description: `Call back on **${lead.phone}**`,
        color: DISCORD_COLOUR,
        fields,
        footer: { text: site.domain },
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

export function buildPayload(url: string, lead: Lead): unknown {
  if (isDiscord(url)) return discordPayload(lead);
  if (isSlack(url)) return { text: clamp(buildSummary(lead), DISCORD_LIMITS.content) };

  // Zapier, Make, or anything bespoke: send everything and let it choose.
  return {
    text: buildSummary(lead),
    lead,
    receivedAt: new Date().toISOString(),
    source: site.domain,
  };
}
