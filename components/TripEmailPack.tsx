"use client";

import { FormEvent, useEffect, useState } from "react";

type TripEmailPackProps = {
  tripId: string;
  tripName: string;
  courseCount: number;
};

type PlannerWindow = Window & {
  gtag?: (
    command: "event",
    eventName: string,
    parameters?: Record<string, string | number | boolean>,
  ) => void;
};

export default function TripEmailPack({
  tripId,
  tripName,
  courseCount,
}: TripEmailPackProps) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState("");

  useEffect(() => {
    let isActive = true;

    fetch("/api/trips/email", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (isActive) setIsAvailable(Boolean(data.available));
      })
      .catch(() => {
        if (isActive) setIsAvailable(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!tripId || courseCount === 0 || isSending) return;

    setError("");
    setSentTo("");
    setIsSending(true);

    try {
      const response = await fetch("/api/trips/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trip_id: tripId,
          email,
          company,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "We could not send your trip pack.");
        return;
      }

      setSentTo(email.trim());
      (window as PlannerWindow).gtag?.("event", "trip_pack_emailed", {
        country: "Ireland",
        trip_id: tripId,
        selected_course_count: courseCount,
      });
    } catch {
      setError("We could not send your trip pack. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  if (!isAvailable) return null;

  return (
    <div className="min-w-0 max-w-full rounded-3xl bg-emerald-950 p-5 text-white shadow-sm lg:p-6">
      <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
        Keep your plan handy
      </p>

      <h2 className="mt-1 text-[20px] font-semibold">Email your trip pack</h2>

      <p className="mt-2 text-sm leading-6 text-emerald-50">
        Get the day-by-day itinerary, green-fee guide, group votes, course
        contacts, directions and daily map routes in one useful email.
      </p>

      {sentTo ? (
        <div
          className="mt-5 rounded-2xl bg-white/10 p-4 ring-1 ring-white/20"
          role="status"
        >
          <div className="font-semibold">Your trip pack is on its way.</div>
          <p className="mt-1 break-words text-sm leading-6 text-emerald-50">
            Sent to {sentTo}. Check your spam folder if it does not arrive in a
            few minutes.
          </p>
          <button
            type="button"
            onClick={() => setSentTo("")}
            className="mt-3 text-sm font-bold text-white underline underline-offset-4"
          >
            Send it to another address
          </button>
        </div>
      ) : (
        <form className="mt-5" onSubmit={handleSubmit}>
          <label
            htmlFor="trip-pack-email"
            className="text-sm font-semibold text-white"
          >
            Email address
          </label>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              id="trip-pack-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              required
              className="min-w-0 flex-1 rounded-2xl border border-white/20 bg-white px-4 py-3 text-base text-slate-900 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/30"
            />

            <button
              type="submit"
              disabled={
                isSending || !tripId || courseCount === 0 || !email.trim()
              }
              className="rounded-2xl bg-emerald-300 px-5 py-3 font-bold text-emerald-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSending ? "Sending..." : "Email my trip pack"}
            </button>
          </div>

          <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="trip-pack-company">Company</label>
            <input
              id="trip-pack-company"
              type="text"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {courseCount === 0 && (
            <p className="mt-3 text-sm text-amber-200">
              Add at least one course before sending your trip pack.
            </p>
          )}

          {error && (
            <p className="mt-3 text-sm leading-6 text-red-200" role="alert">
              {error}
            </p>
          )}

          <p className="mt-3 text-xs leading-5 text-emerald-100">
            This sends one transactional email for {tripName || "your trip"}.
            We will not add this address to a marketing list.
          </p>
        </form>
      )}
    </div>
  );
}
