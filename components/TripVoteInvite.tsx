"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type GtagWindow = Window & {
  gtag?: (
    command: "event",
    eventName: string,
    parameters?: Record<string, string | number | boolean>,
  ) => void;
};

function trackEvent(
  eventName: string,
  parameters: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined") return;
  (window as GtagWindow).gtag?.("event", eventName, parameters);
}

export default function TripVoteInvite({
  tripId,
  tripName,
  courseCount,
  participantCount,
}: {
  tripId: string;
  tripName: string;
  courseCount: number;
  participantCount: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const votePath = `/ireland/planner/vote?tripId=${encodeURIComponent(tripId)}`;
  const publicVoteUrl = `https://guestplaygolf.com${votePath}`;
  const shareMessage = useMemo(
    () =>
      `Help choose the courses for ${tripName || "our golf trip"}. Vote on the options and suggest any courses we have missed:`,
    [tripName],
  );

  function getShareUrl() {
    return `${window.location.origin}${votePath}`;
  }

  function recordShare(method: string) {
    trackEvent("trip_vote_invite_shared", {
      trip_id: tripId,
      method,
      course_count: courseCount,
    });
  }

  async function copyInvite() {
    try {
      await window.navigator.clipboard.writeText(
        `${shareMessage} ${getShareUrl()}`,
      );
      recordShare("copy_link");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  async function shareNatively() {
    if (!window.navigator.share) {
      await copyInvite();
      return;
    }

    try {
      await window.navigator.share({
        title: tripName || "GuestPlayGolf trip vote",
        text: shareMessage,
        url: getShareUrl(),
      });
      recordShare("native_share");
    } catch {
      // Closing the share sheet is not an error the user needs to see.
    }
  }

  function openInvite() {
    setIsOpen((current) => !current);
    trackEvent("trip_vote_invite_opened", {
      trip_id: tripId,
      course_count: courseCount,
    });
  }

  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-white to-emerald-50 shadow-sm ring-1 ring-emerald-900/10">
      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
            Group decision
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            Invite your group to vote and suggest courses
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {courseCount > 0
              ? `${courseCount} ${courseCount === 1 ? "course is" : "courses are"} on the board. Your group can vote on every option and add courses you may have missed.`
              : "Start the conversation now. Your group can propose the first courses and vote together—an empty itinerary does not have to stay empty."}
          </p>
          {participantCount > 0 && (
            <p className="mt-3 inline-flex rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-900">
              {participantCount} {participantCount === 1 ? "golfer has" : "golfers have"} voted
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={openInvite}
          className="rounded-full bg-emerald-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800"
          aria-expanded={isOpen}
        >
          Invite group to vote
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-emerald-900/10 bg-white/80 p-5 sm:p-6">
          <p className="text-sm font-semibold text-slate-900">
            Share a focused voting room—not the editable itinerary.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${shareMessage} ${publicVoteUrl}`)}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => recordShare("whatsapp")}
              className="rounded-2xl bg-[#25D366] px-4 py-3 text-center text-sm font-bold text-slate-950 no-underline"
            >
              Share on WhatsApp
            </a>
            <button
              type="button"
              onClick={shareNatively}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800"
            >
              Phone share menu
            </button>
            <button
              type="button"
              onClick={copyInvite}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800"
            >
              {copied ? "Invite copied ✓" : "Copy invite"}
            </button>
            <Link
              href={votePath}
              onClick={() => recordShare("open_vote_room")}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-bold text-white no-underline"
            >
              Open voting room
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
