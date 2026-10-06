import type { BookingType } from "./booking";

/**
 * What the confirmation page needs to describe the booking just made.
 *
 * Carried in sessionStorage rather than the URL on purpose: `/confirmed` stays
 * one clean path for analytics to count, and no name or time ends up in a
 * query string that Google Analytics would record (its terms forbid sending
 * personal data).
 */

export type BookingReceipt = {
  type: BookingType;
  startsAt: string;
  firstName: string;
  /** Whether a confirmation email with the calendar file went out. */
  confirmationSent: boolean;
  /** Set once the conversion has been reported, so a refresh can't repeat it. */
  tracked?: boolean;
};

const KEY = "laundrogrid:booking";

export function saveReceipt(receipt: BookingReceipt): void {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(receipt));
  } catch {
    // Private mode or blocked storage: the page falls back to generic wording.
  }
}

export function readReceipt(): BookingReceipt | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as BookingReceipt;
    return Number.isNaN(new Date(value.startsAt).getTime()) ? null : value;
  } catch {
    return null;
  }
}
