import { NextResponse } from "next/server";
import { availableSlots } from "@/lib/google-calendar";

/**
 * The slots the booking form may offer: UK office hours for the coming
 * weekdays, minus anything already taken on the team calendar.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse<{ slots: string[] }>> {
  return NextResponse.json(
    { slots: await availableSlots() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
