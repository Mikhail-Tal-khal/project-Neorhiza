/**
 * Donation record boundary.
 *
 * Stripe is the payment system of record. This website does NOT store
 * contributions in a database: the default recorder below writes one
 * structured, secret-free log line per verified webhook event.
 *
 * TODO(persistence): to keep an internal ledger, implement DonationRecorder
 * against a database and assign it to `donationRecorder`. Upsert on
 * `eventId` (and/or `sessionId`) so retried deliveries stay idempotent, and
 * throw on failure so the webhook returns 5xx and Stripe retries.
 *
 * TODO(receipts): Stripe can email receipts itself (Dashboard → Settings →
 * Customer emails → "Successful payments"). If custom donor receipts are
 * added, send them from a recorder after persistence succeeds, fetching the
 * email from Stripe at send time rather than storing or logging it here.
 */

export type DonationOutcome = "confirmed" | "pending" | "failed";

/** Only non-personal fields. No email, name, address or payment-method data. */
export type DonationEventRecord = {
  eventId: string;
  eventType: string;
  sessionId: string;
  amountTotal: number | null;
  currency: string | null;
  paymentStatus: string | null;
  outcome: DonationOutcome;
  livemode: boolean;
};

export interface DonationRecorder {
  record(entry: DonationEventRecord): Promise<void>;
}

/** Default recorder: a structured log line (Vercel function logs). */
export const logRecorder: DonationRecorder = {
  async record(entry) {
    // eslint-disable-next-line no-console -- informational audit line for a verified Stripe event, not an error
    console.info(JSON.stringify({ msg: "stripe.donation", ...entry }));
  },
};

let current: DonationRecorder = logRecorder;

export function donationRecorder(): DonationRecorder {
  return current;
}

/** Swap the recorder (persistence adapters, tests). */
export function setDonationRecorder(recorder: DonationRecorder) {
  current = recorder;
}
