"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type VoteValue = "must_play" | "happy_to_play" | "not_for_me";

type TripCourse = {
  id: number;
  course_name: string;
  town?: string;
  region?: string;
  holes?: number;
  independent_guest_days?: string;
  price_range?: string;
  course_type?: string;
  course_image?: string;
  distance?: number | null;
  suggested_by_name?: string;
  suggested_by_participant_id?: string;
  suggested_at?: string;
  suggestion_source?: string;
};

type Trip = {
  trip_id: string;
  trip_name?: string;
  trip_code?: string;
  base_location?: string;
  month_of_travel?: string;
  number_of_golfers?: number;
  number_of_golf_days?: number;
  selected_courses?: TripCourse[];
};

type VoteSummary = Record<
  number,
  {
    must_play: number;
    happy_to_play: number;
    not_for_me: number;
    score: number;
  }
>;

type Participant = {
  name: string;
  vote_count: number;
};

type Identity = {
  participantId: string;
  name: string;
};

type GtagWindow = Window & {
  gtag?: (
    command: "event",
    eventName: string,
    parameters?: Record<string, string | number | boolean>,
  ) => void;
};

const voteOptions: {
  value: VoteValue;
  emoji: string;
  label: string;
  activeClass: string;
}[] = [
  {
    value: "must_play",
    emoji: "🔥",
    label: "Must play",
    activeClass: "bg-amber-500 text-slate-950 ring-amber-500",
  },
  {
    value: "happy_to_play",
    emoji: "👍",
    label: "Happy to play",
    activeClass: "bg-emerald-800 text-white ring-emerald-800",
  },
  {
    value: "not_for_me",
    emoji: "👎",
    label: "Not for me",
    activeClass: "bg-slate-700 text-white ring-slate-700",
  },
];

function trackEvent(
  eventName: string,
  parameters: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined") return;
  (window as GtagWindow).gtag?.("event", eventName, parameters);
}

function encodeName(name: string) {
  const bytes = new TextEncoder().encode(name);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function createParticipantId(name: string) {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 16)
      : Math.random().toString(36).slice(2, 18);

  return `GPG-P-${random}.${encodeName(name)}`;
}

function identityStorageKey(tripId: string) {
  return `guestplaygolf_vote_identity_${tripId}`;
}

function getVoteSummary(summary: VoteSummary, courseId: number) {
  return (
    summary[courseId] || {
      must_play: 0,
      happy_to_play: 0,
      not_for_me: 0,
      score: 0,
    }
  );
}

function getShortLocation(location?: string) {
  return location?.split(",")[0]?.trim() || "Ireland";
}

export default function TripVotePage() {
  const [tripId, setTripId] = useState("");
  const [trip, setTrip] = useState<Trip | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [firstName, setFirstName] = useState("");
  const [selectedVotes, setSelectedVotes] = useState<Record<number, VoteValue>>(
    {},
  );
  const [voteSummary, setVoteSummary] = useState<VoteSummary>({});
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingVotes, setIsLoadingVotes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TripCourse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestingCourseId, setSuggestingCourseId] = useState<number | null>(
    null,
  );

  const courses = useMemo(
    () => (Array.isArray(trip?.selected_courses) ? trip.selected_courses : []),
    [trip],
  );
  const selectedVoteCount = Object.keys(selectedVotes).length;

  const rankedCourses = useMemo(
    () =>
      [...courses].sort((left, right) => {
        const leftSummary = getVoteSummary(voteSummary, left.id);
        const rightSummary = getVoteSummary(voteSummary, right.id);

        if (rightSummary.score !== leftSummary.score) {
          return rightSummary.score - leftSummary.score;
        }
        if (rightSummary.must_play !== leftSummary.must_play) {
          return rightSummary.must_play - leftSummary.must_play;
        }
        return left.course_name.localeCompare(right.course_name);
      }),
    [courses, voteSummary],
  );

  async function loadVotes(activeTripId: string, participantId?: string) {
    setIsLoadingVotes(true);

    try {
      const params = new URLSearchParams({ tripId: activeTripId });
      if (participantId) params.set("participantId", participantId);

      const response = await fetch(`/api/trips/vote?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) return;

      setVoteSummary(data.summary || {});
      setParticipants(Array.isArray(data.participants) ? data.participants : []);
      setParticipantCount(Number(data.participant_count) || 0);

      if (participantId) {
        const participantVotes = data.participant_votes || {};
        setSelectedVotes(participantVotes);
        const returningVoter = Object.keys(participantVotes).length > 0;
        setHasSubmitted(returningVoter);
        setShowResults(returningVoter);
      }
    } catch {
      // The ballot remains usable even if totals cannot be loaded immediately.
    } finally {
      setIsLoadingVotes(false);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const activeTripId = params.get("tripId")?.trim() || "";

    if (!activeTripId) {
      setError("This voting link is incomplete. Ask the organiser for a new link.");
      setIsLoading(false);
      return;
    }

    setTripId(activeTripId);

    async function loadTrip() {
      try {
        const response = await fetch(
          `/api/trips/get?tripId=${encodeURIComponent(activeTripId)}`,
          { cache: "no-store" },
        );
        const data = await response.json();

        if (!response.ok || !data.trip) {
          setError(data.error || "We could not find this trip.");
          return;
        }

        setTrip(data.trip);
        trackEvent("trip_vote_page_opened", {
          trip_id: activeTripId,
          course_count: Array.isArray(data.trip.selected_courses)
            ? data.trip.selected_courses.length
            : 0,
        });

        let storedIdentity: Identity | null = null;
        try {
          const stored = window.localStorage.getItem(
            identityStorageKey(activeTripId),
          );
          storedIdentity = stored ? JSON.parse(stored) : null;
        } catch {
          storedIdentity = null;
        }

        if (storedIdentity?.participantId && storedIdentity?.name) {
          setIdentity(storedIdentity);
          setFirstName(storedIdentity.name);
          await loadVotes(activeTripId, storedIdentity.participantId);
        } else {
          await loadVotes(activeTripId);
        }
      } catch {
        setError("Something went wrong while opening this trip.");
      } finally {
        setIsLoading(false);
      }
    }

    loadTrip();
  }, []);

  useEffect(() => {
    if (!showSuggestions || !tripId) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const params = new URLSearchParams({ tripId, q: searchQuery });
        const response = await fetch(`/api/courses/search?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = await response.json();
        if (response.ok) {
          setSearchResults(Array.isArray(data.courses) ? data.courses : []);
        }
      } catch (requestError) {
        if ((requestError as Error).name !== "AbortError") {
          setSearchResults([]);
        }
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [searchQuery, showSuggestions, tripId]);

  function saveIdentity(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = firstName.trim().replace(/[<>]/g, "").slice(0, 30);

    if (!cleanName || !tripId) return;

    const nextIdentity = {
      participantId: createParticipantId(cleanName),
      name: cleanName,
    };

    window.localStorage.setItem(
      identityStorageKey(tripId),
      JSON.stringify(nextIdentity),
    );
    setIdentity(nextIdentity);
    setFirstName(cleanName);
    trackEvent("trip_vote_name_saved", { trip_id: tripId });
    loadVotes(tripId, nextIdentity.participantId);
  }

  function selectVote(courseId: number, vote: VoteValue) {
    setSelectedVotes((current) => {
      if (current[courseId] === vote) {
        const next = { ...current };
        delete next[courseId];
        return next;
      }

      return { ...current, [courseId]: vote };
    });
    setSuccessMessage("");
    trackEvent("trip_vote_choice_made", {
      trip_id: tripId,
      course_id: courseId,
      vote,
    });
  }

  async function submitBallot() {
    if (!identity || !tripId || selectedVoteCount === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/trips/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trip_id: tripId,
          participant_id: identity.participantId,
          votes: Object.entries(selectedVotes).map(([courseId, vote]) => ({
            course_id: Number(courseId),
            vote,
          })),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "We could not save your votes.");
        return;
      }

      setVoteSummary(data.summary || {});
      setParticipants(Array.isArray(data.participants) ? data.participants : []);
      setParticipantCount(Number(data.participant_count) || 0);
      setHasSubmitted(true);
      setShowResults(true);
      setSuccessMessage("Your votes are in. Thanks for helping shape the trip.");
      trackEvent("trip_vote_ballot_submitted", {
        trip_id: tripId,
        vote_count: selectedVoteCount,
        course_count: courses.length,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Something went wrong while saving your votes.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function suggestCourse(course: TripCourse) {
    if (!identity || !tripId || suggestingCourseId) return;

    setSuggestingCourseId(course.id);
    setError("");

    try {
      const response = await fetch("/api/trips/suggest-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trip_id: tripId,
          course_id: course.id,
          participant_id: identity.participantId,
          participant_name: identity.name,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "We could not add this suggestion.");
        return;
      }

      setTrip((current) =>
        current
          ? {
              ...current,
              selected_courses: Array.isArray(data.selected_courses)
                ? data.selected_courses
                : current.selected_courses,
            }
          : current,
      );
      setSelectedVotes((current) => ({
        ...current,
        [course.id]: "must_play",
      }));
      setSearchResults((current) =>
        current.filter((result) => result.id !== course.id),
      );
      setShowSuggestions(false);
      setShowResults(false);
      setSuccessMessage(
        `${course.course_name} is now on the group board, with your Must play choice ready to submit.`,
      );
      trackEvent("trip_course_suggested", {
        trip_id: tripId,
        course_id: course.id,
      });
    } catch {
      setError("Something went wrong while adding this suggestion.");
    } finally {
      setSuggestingCourseId(null);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-stone-100 px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-semibold text-emerald-800">
            Opening the group voting room…
          </p>
        </div>
      </main>
    );
  }

  if (!trip) {
    return (
      <main className="min-h-screen bg-stone-100 px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
            GuestPlayGolf
          </p>
          <h1 className="mt-3 text-2xl font-bold text-slate-950">
            We could not open this voting room
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">{error}</p>
          <Link
            href="/ireland/planner"
            className="mt-6 inline-block rounded-full bg-emerald-900 px-5 py-3 text-sm font-bold text-white no-underline"
          >
            Open the golf trip planner
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-100 pb-20 text-slate-900">
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 px-4 pb-12 pt-8 text-white sm:pb-16 sm:pt-12">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-100 no-underline"
          >
            GuestPlayGolf
          </Link>
          <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <p className="text-sm font-semibold text-emerald-200">
                You have been invited to help decide
              </p>
              <h1 className="mt-2 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
                {trip.trip_name || "Group golf trip"}
              </h1>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80">
                <span>📍 {getShortLocation(trip.base_location)}</span>
                {trip.month_of_travel && <span>📅 {trip.month_of_travel}</span>}
                {trip.number_of_golfers && (
                  <span>👥 {trip.number_of_golfers} golfers</span>
                )}
                <span>⛳ {courses.length} options</span>
              </div>
            </div>
            {participantCount > 0 && (
              <div className="rounded-2xl bg-white/10 px-5 py-4 ring-1 ring-white/15 backdrop-blur">
                <div className="text-2xl font-black">
                  {participantCount}
                  {trip.number_of_golfers
                    ? ` of ${trip.number_of_golfers}`
                    : ""}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wide text-emerald-100">
                  {participantCount === 1 ? "golfer has voted" : "golfers have voted"}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto -mt-6 max-w-5xl px-4">
        {error && (
          <div role="alert" className="mb-4 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800 ring-1 ring-red-200">
            {error}
          </div>
        )}
        {successMessage && (
          <div role="status" className="mb-4 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-900 ring-1 ring-emerald-200">
            {successMessage}
          </div>
        )}

        {!identity ? (
          <section className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
              One quick step
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              What’s your first name?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              No account is needed. Your group will simply see who has joined the decision.
            </p>
            <form onSubmit={saveIdentity} className="mt-5 flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="first-name">
                First name
              </label>
              <input
                id="first-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                autoComplete="given-name"
                maxLength={30}
                placeholder="Your first name"
                className="min-w-0 flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
              />
              <button
                type="submit"
                disabled={!firstName.trim()}
                className="rounded-2xl bg-emerald-900 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                Join the vote
              </button>
            </form>
          </section>
        ) : showResults ? (
          <section className="rounded-3xl bg-white p-5 shadow-xl ring-1 ring-slate-200 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
                  Group results
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  The courses your group prefers
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Results reflect this trip only. They do not contribute to any wider GuestPlayGolf course ranking.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowResults(false)}
                className="shrink-0 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-800"
              >
                Review my votes
              </button>
            </div>

            {isLoadingVotes ? (
              <p className="mt-8 text-sm text-slate-600">Refreshing results…</p>
            ) : (
              <div className="mt-7 grid gap-3">
                {rankedCourses.map((course, index) => {
                  const summary = getVoteSummary(voteSummary, course.id);
                  return (
                    <div
                      key={course.id}
                      className="grid gap-4 rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-black text-white">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-bold text-slate-950">
                          {course.course_name}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {[course.region, course.price_range]
                            .filter(Boolean)
                            .join(" · ")}
                        </div>
                        {course.suggested_by_name && (
                          <div className="mt-2 text-xs font-semibold text-emerald-800">
                            Suggested by {course.suggested_by_name}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs font-bold">
                        <span className="rounded-full bg-amber-100 px-3 py-1.5 text-amber-950">
                          🔥 {summary.must_play}
                        </span>
                        <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-emerald-900">
                          👍 {summary.happy_to_play}
                        </span>
                        <span className="rounded-full bg-slate-200 px-3 py-1.5 text-slate-700">
                          👎 {summary.not_for_me}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {participants.length > 0 && (
              <div className="mt-8 border-t border-slate-200 pt-6">
                <h3 className="text-sm font-bold text-slate-950">Who has voted</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {participants.map((participant, index) => (
                    <span
                      key={`${participant.name}-${index}`}
                      className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-900 ring-1 ring-emerald-100"
                    >
                      {participant.name} · {participant.vote_count} choices
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        ) : (
          <>
            <section className="rounded-3xl bg-white p-5 shadow-xl ring-1 ring-slate-200 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
                    {hasSubmitted ? `Welcome back, ${identity.name}` : `Your say, ${identity.name}`}
                  </p>
                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                    Vote on any courses you have an opinion on
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    There is no limit. Leave any course blank if you have no view, and suggest another option whenever something is missing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSuggestions(true)}
                  className="shrink-0 rounded-full bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-sm"
                >
                  + Suggest a course
                </button>
              </div>

              {courses.length === 0 ? (
                <div className="mt-8 rounded-3xl border border-dashed border-emerald-300 bg-emerald-50 p-8 text-center">
                  <div className="text-4xl">⛳</div>
                  <h3 className="mt-3 text-xl font-bold text-slate-950">
                    Be the first to put a course on the board
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Search GuestPlayGolf and suggest the courses you want the group to consider.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowSuggestions(true)}
                    className="mt-5 rounded-full bg-emerald-900 px-5 py-3 text-sm font-bold text-white"
                  >
                    Suggest the first course
                  </button>
                </div>
              ) : (
                <div className="mt-7 grid gap-4 lg:grid-cols-2">
                  {courses.map((course) => (
                    <article
                      key={course.id}
                      className="overflow-hidden rounded-3xl bg-stone-50 ring-1 ring-slate-200"
                    >
                      {course.course_image && (
                        <div
                          className="h-36 bg-cover bg-center"
                          style={{ backgroundImage: `url(${course.course_image})` }}
                          role="img"
                          aria-label={`${course.course_name} golf course`}
                        />
                      )}
                      <div className="p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-bold text-slate-950">
                              {course.course_name}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                              {[
                                course.town || course.region,
                                course.course_type,
                                course.price_range,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          </div>
                          <Link
                            href={`/courses/${course.id}`}
                            target="_blank"
                            className="shrink-0 text-xs font-bold text-emerald-800 no-underline"
                          >
                            Details ↗
                          </Link>
                        </div>

                        {course.suggested_by_name && (
                          <p className="mt-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-950">
                            Suggested by {course.suggested_by_name}
                          </p>
                        )}

                        <div className="mt-4 grid grid-cols-3 gap-2">
                          {voteOptions.map((option) => {
                            const selected = selectedVotes[course.id] === option.value;
                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => selectVote(course.id, option.value)}
                                aria-pressed={selected}
                                className={`rounded-2xl px-2 py-3 text-center text-[11px] font-bold leading-tight ring-1 transition sm:text-xs ${
                                  selected
                                    ? option.activeClass
                                    : "bg-white text-slate-700 ring-slate-200 hover:ring-emerald-300"
                                }`}
                              >
                                <span className="block text-lg leading-none">
                                  {option.emoji}
                                </span>
                                <span className="mt-1.5 block">{option.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {courses.length > 0 && (
              <div className="sticky bottom-4 z-20 mt-5 rounded-3xl bg-slate-950 p-4 text-white shadow-2xl ring-1 ring-white/10 sm:flex sm:items-center sm:justify-between sm:gap-4">
                <div>
                  <div className="text-sm font-bold">
                    {selectedVoteCount === 0
                      ? "Choose at least one course"
                      : `${selectedVoteCount} ${selectedVoteCount === 1 ? "course" : "courses"} rated`}
                  </div>
                  <div className="mt-1 text-xs text-white/60">
                    You can return and update these choices later.
                  </div>
                </div>
                <button
                  type="button"
                  disabled={selectedVoteCount === 0 || isSubmitting}
                  onClick={submitBallot}
                  className="mt-3 w-full rounded-2xl bg-amber-400 px-5 py-3 text-sm font-black text-slate-950 disabled:opacity-50 sm:mt-0 sm:w-auto"
                >
                  {isSubmitting
                    ? "Saving your votes…"
                    : hasSubmitted
                      ? "Update my votes"
                      : "Submit my votes"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {identity && showSuggestions && (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="suggest-course-title"
            className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-2xl sm:rounded-3xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
                  Open course board
                </p>
                <h2 id="suggest-course-title" className="mt-2 text-2xl font-bold text-slate-950">
                  Suggest another course
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Nearby options appear first. You can also search by course, town or county.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSuggestions(false)}
                aria-label="Close course suggestions"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-slate-700"
              >
                ×
              </button>
            </div>

            <label className="mt-5 block text-sm font-bold text-slate-900" htmlFor="course-search">
              Find a course
            </label>
            <input
              id="course-search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="e.g. Ballybunion, Donegal or Lahinch"
              autoFocus
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
            />

            <div className="mt-5">
              {isSearching ? (
                <p className="py-6 text-center text-sm text-slate-500">
                  Searching GuestPlayGolf…
                </p>
              ) : searchResults.length === 0 ? (
                <p className="rounded-2xl bg-stone-50 p-5 text-center text-sm text-slate-600">
                  No matching course is available to add.
                </p>
              ) : (
                <div className="grid gap-3">
                  {searchResults.map((course) => (
                    <div
                      key={course.id}
                      className="flex flex-col gap-3 rounded-2xl bg-stone-50 p-4 ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-950">
                          {course.course_name}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {[course.town || course.region, course.course_type, course.price_range]
                            .filter(Boolean)
                            .join(" · ")}
                          {typeof course.distance === "number" &&
                            ` · ${course.distance.toFixed(0)} km from base`}
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={suggestingCourseId === course.id}
                        onClick={() => suggestCourse(course)}
                        className="shrink-0 rounded-full bg-emerald-900 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50"
                      >
                        {suggestingCourseId === course.id ? "Adding…" : "Suggest course"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
