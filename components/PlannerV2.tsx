"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CourseCard from "@/components/CourseCard";
import type { Course } from "@/lib/course-explorer";
import { distanceKm, filterCourses } from "@/lib/course-explorer";

const CourseMap = dynamic(() => import("@/components/CountyCourseMap"), { ssr: false });

type Country = "Ireland" | "Switzerland" | "Portugal";
type TripCourse = Course & { distance?: number | null };
type PlannerAnalyticsParams = Record<string, string | number | boolean>;

function trackPlannerEvent(eventName: string, parameters: PlannerAnalyticsParams = {}) {
  if (typeof window === "undefined") return;
  const analyticsWindow = window as Window & {
    gtag?: (command: "event", name: string, values?: PlannerAnalyticsParams) => void;
  };
  analyticsWindow.gtag?.("event", eventName, parameters);
}

type Trip = {
  trip_id: string;
  trip_code?: string;
  trip_name: string;
  country?: Country;
  base_location: string;
  base_latitude?: number | null;
  base_longitude?: number | null;
  courses_wanted?: number | null;
  number_of_golfers?: number | null;
  selected_courses?: TripCourse[] | null;
};
type Summary = Record<number, { up: number; down: number; score: number }>;

const presets: Record<Country, { bases: string[]; center: [number, number]; currency: "€" | "CHF" }> = {
  Ireland: { bases: ["Dublin", "Cork", "Galway", "Killarney", "Lahinch", "Belfast"], center: [53.4, -8], currency: "€" },
  Switzerland: { bases: ["Zurich", "Geneva", "Basel", "Lausanne", "Lucerne", "Interlaken"], center: [46.8, 8.2], currency: "CHF" },
  Portugal: { bases: ["Vilamoura", "Albufeira", "Lagos", "Faro", "Tavira", "Quinta do Lago"], center: [39.5, -8], currency: "€" },
};

const slug = (country: Country) => country.toLowerCase();
const tokenKey = (country: Country, tripId: string) => `guestplaygolf_${slug(country)}_owner_token_${tripId}`;
const legacyOwnerKey = (country: Country) => country === "Ireland" ? "guestplaygolf_planner_user_id" : `guestplaygolf_${slug(country)}_planner_user_id`;
const participantKey = (country: Country) => `guestplaygolf_${slug(country)}_v2_participant`;
const activeTripKey = (country: Country) => country === "Ireland" ? "guestplaygolf_trip_id" : `guestplaygolf_${slug(country)}_trip_id`;
const activeCoursesKey = (country: Country) => country === "Ireland" ? "guestplaygolf_planner_courses" : `guestplaygolf_${slug(country)}_planner_courses`;
const plannerRoute = (country: Country) => country === "Portugal" ? "/portugal/planner" : country === "Switzerland" ? "/switzerland/planner" : "/ireland/planner";

function getParticipantId(country: Country) {
  let guest = window.localStorage.getItem(participantKey(country));
  if (!guest) {
    guest = `guest-${crypto.randomUUID()}`;
    window.localStorage.setItem(participantKey(country), guest);
  }
  return guest;
}

function getPlannerUserId(country: Country) {
  let id = window.localStorage.getItem(legacyOwnerKey(country));
  if (!id) {
    id = `GPG-USER-${crypto.randomUUID()}`;
    window.localStorage.setItem(legacyOwnerKey(country), id);
  }
  return id;
}

function bandRange(band: string | null | undefined, currency: string): [number, number | null] | null {
  const clean = band?.replace(/Â/g, "").trim();
  if (currency === "CHF") {
    const index = ["€", "€€", "€€€", "€€€€", "€€€€€"].indexOf(clean || "");
    return index < 0 ? null : ([[0, 80], [81, 120], [121, 160], [161, null], [161, null]][index] as [number, number | null]);
  }
  const index = ["€", "€€", "€€€", "€€€€", "€€€€€"].indexOf(clean || "");
  return index < 0 ? null : ([[0, 50], [50, 100], [100, 200], [200, 300], [300, 450]][index] as [number, number | null]);
}

function displayBand(country: Country, band: string) {
  if (country !== "Switzerland") return band;
  const ranges: Record<string, string> = { "€": "CHF 0–80", "€€": "CHF 81–120", "€€€": "CHF 121–160", "€€€€": "CHF 161+", "€€€€€": "CHF 161+" };
  return ranges[band] || band;
}

function tripCountry(value: string | null, fallback: Country): Country {
  const normal = value?.toLowerCase();
  return normal === "ireland" ? "Ireland" : normal === "switzerland" ? "Switzerland" : normal === "portugal" ? "Portugal" : fallback;
}

export default function PlannerV2({ country: initialCountry, courses }: { country: Country; courses: Course[] }) {
  const [country, setCountry] = useState<Country>(initialCountry);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [tripName, setTripName] = useState("");
  const [golfers, setGolfers] = useState("");
  const [tripId, setTripId] = useState("");
  const [ownerToken, setOwnerToken] = useState("");
  const [legacyOwnerId, setLegacyOwnerId] = useState("");
  const [plannerUserId, setPlannerUserId] = useState("");
  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);
  const [participantId, setParticipantId] = useState("");
  const [votes, setVotes] = useState<Record<number, "up" | "down" | null>>({});
  const [summary, setSummary] = useState<Summary>({});
  const [base, setBase] = useState("");
  const [target, setTarget] = useState("");
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [search, setSearch] = useState("");
  const [prices, setPrices] = useState<string[]>([]);
  const [courseType, setCourseType] = useState("");
  const [region, setRegion] = useState("");
  const [holes, setHoles] = useState("");
  const [access, setAccess] = useState("");
  const [radius, setRadius] = useState("");
  const [view, setView] = useState<"list" | "map">("list");
  const [plannerQueryLoaded, setPlannerQueryLoaded] = useState(false);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [queryTrip, setQueryTrip] = useState("");
  const [shareOptions, setShareOptions] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQueryTrip(params.get("tripId") || "");
    setSearch(params.get("search") || "");
    setPrices(params.getAll("price"));
    setCourseType(params.get("courseType") || "");
    setRegion(params.get("region") || "");
    setHoles(params.get("holes") || "");
    setAccess(params.get("access") || "");
    setRadius(params.get("radius") || "");
    setView(params.get("view") === "map" ? "map" : "list");
    const storedId = window.localStorage.getItem(activeTripKey(initialCountry));
    const id = params.get("tripId") || storedId || "";
    setTripId(id);
    setOwnerToken(id ? window.localStorage.getItem(tokenKey(initialCountry, id)) || "" : "");
    setLegacyOwnerId(window.localStorage.getItem(legacyOwnerKey(initialCountry)) || "");
    const ownerId = getPlannerUserId(initialCountry);
    setPlannerUserId(ownerId);
    void loadSavedTrips(ownerId);
    const guest = getParticipantId(initialCountry);
    setParticipantId(guest);
    if (id) void loadTrip(id, initialCountry, guest);
    setPlannerQueryLoaded(true);
  // Initial route parsing intentionally runs once; the country selector only changes new-trip country.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!plannerQueryLoaded) return;
    const params = new URLSearchParams();
    if (tripId) params.set("tripId", tripId);
    if (search) params.set("search", search);
    prices.forEach((price) => params.append("price", price));
    if (courseType) params.set("courseType", courseType);
    if (region) params.set("region", region);
    if (holes) params.set("holes", holes);
    if (access) params.set("access", access);
    if (radius) params.set("radius", radius);
    if (view === "map") params.set("view", "map");
    const query = params.toString();
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
  }, [plannerQueryLoaded, tripId, search, prices, courseType, region, holes, access, radius, view]);

  useEffect(() => {
    if (!tripId || !participantId) return;
    const refresh = () => { void loadTrip(tripId, country, participantId); };
    window.addEventListener("guestplaygolf-planner-courses-updated", refresh);
    const timer = window.setInterval(refresh, 15000);
    return () => {
      window.removeEventListener("guestplaygolf-planner-courses-updated", refresh);
      window.clearInterval(timer);
    };
  // loadTrip uses stable React setters and the effect is keyed by the trip and guest.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId, participantId, country]);

  async function loadTrip(id: string, fallback: Country, guest: string) {
    setBusy(true);
    try {
      const response = await fetch(`/api/trips/get?tripId=${encodeURIComponent(id)}`);
      const data = await response.json();
      if (!response.ok || !data.trip) throw new Error(data.error || "Trip could not be loaded.");
      const loaded = data.trip as Trip;
      const loadedCountry = tripCountry(loaded.country || null, fallback);
      setCountry(loadedCountry);
      setOwnerToken(window.localStorage.getItem(tokenKey(loadedCountry, id)) || "");
      setLegacyOwnerId(window.localStorage.getItem(legacyOwnerKey(loadedCountry)) || "");
      const ownerId = getPlannerUserId(loadedCountry);
      setPlannerUserId(ownerId);
      void loadSavedTrips(ownerId);
      setTrip(loaded);
      setTripName(loaded.trip_name || `${loaded.base_location} Golf Trip`);
      setGolfers(loaded.number_of_golfers && loaded.number_of_golfers > 1 ? String(loaded.number_of_golfers) : "");
      setBase(loaded.base_location || "");
      setTarget(loaded.courses_wanted ? String(loaded.courses_wanted) : "");
      setCoordinates(loaded.base_latitude != null && loaded.base_longitude != null ? [Number(loaded.base_latitude), Number(loaded.base_longitude)] : null);
      window.localStorage.setItem(activeTripKey(loadedCountry), id);
      window.localStorage.setItem(activeCoursesKey(loadedCountry), JSON.stringify(loaded.selected_courses || []));
      const voteResponse = await fetch(`/api/trips/vote?tripId=${encodeURIComponent(id)}&participantId=${encodeURIComponent(guest)}`);
      const voteData = await voteResponse.json();
      if (voteResponse.ok) { setSummary(voteData.summary || {}); setVotes(voteData.participant_votes || {}); }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Trip could not be loaded.");
    } finally { setBusy(false); }
  }

  async function loadSavedTrips(ownerId: string) {
    try {
      const response = await fetch(`/api/trips/list?plannerUserId=${encodeURIComponent(ownerId)}`);
      const data = await response.json();
      if (response.ok && Array.isArray(data.trips)) setSavedTrips(data.trips);
    } catch { /* Saved trips are an enhancement; a shared trip URL still works. */ }
  }

  async function openSavedTrip(id: string, savedCountry: Country) {
    const destination = `${plannerRoute(savedCountry)}?tripId=${encodeURIComponent(id)}`;
    if (window.location.pathname !== plannerRoute(savedCountry)) {
      window.location.assign(destination);
      return;
    }
    window.history.replaceState({}, "", destination);
    setCountry(savedCountry);
    setTripId(id);
    await loadTrip(id, savedCountry, getParticipantId(savedCountry));
  }

  const tripCourses = useMemo(() => trip?.selected_courses || [], [trip?.selected_courses]);
  const leading = useMemo(() => [...tripCourses].sort((a, b) => (summary[b.id]?.score || 0) - (summary[a.id]?.score || 0)), [tripCourses, summary]);
  const targetCount = Math.max(1, Number(trip?.courses_wanted) || leading.length || 3);
  const boundaryIndex = Math.min(targetCount, leading.length) - 1;
  const boundaryScore = boundaryIndex >= 0 ? summary[leading[boundaryIndex].id]?.score || 0 : null;
  const leaders = boundaryScore === null ? [] : leading.filter((course, index) => index < targetCount || (summary[course.id]?.score || 0) === boundaryScore);
  const otherShortlist = leading.slice(leaders.length);
  const estimate = leaders.map((c) => bandRange(c.price_range, presets[country].currency)).filter((range): range is [number, number | null] => Boolean(range));
  const low = estimate.reduce((sum, range) => sum + range[0], 0);
  const openEndedEstimate = estimate.some((range) => range[1] === null);
  const high = estimate.reduce((sum, range) => sum + (range[1] ?? 0), 0);
  const features = useMemo(() => {
    const tripIds = new Set(tripCourses.map((course) => course.id));
    return courses.filter((course) => !tripIds.has(course.id)).map((course) => ({ ...course, distance: coordinates ? distanceKm(course, coordinates) : null }));
  }, [courses, tripCourses, coordinates]);
  const filtered = useMemo(() => {
    const result = filterCourses(features, { price: "", courseType, holes, county: region, when: access, search, radius }, coordinates, coordinates ? "distance" : "name");
    return prices.length ? result.filter((course) => prices.includes(course.price_range?.trim() || "")) : result;
  }, [features, courseType, region, holes, access, search, radius, coordinates, prices]);
  const regions = [...new Set(courses.map((c) => c.region?.trim()).filter((x): x is string => Boolean(x)))].sort();
  const types = [...new Set(courses.map((c) => c.course_type?.trim()).filter((x): x is string => Boolean(x)))].sort();
  const holeCounts = [...new Set(courses.map((c) => c.holes).filter((x): x is number => x != null))].sort((a, b) => a - b);
  const accessOptions = [...new Set(["Everyday", "Weekdays", "Weekend", "Limited Access", ...courses.map((c) => c.independent_guest_days?.trim()).filter((x): x is string => Boolean(x))])];

  async function locateBase() {
    if (!base.trim()) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/geocode?country=${encodeURIComponent(country)}&place=${encodeURIComponent(base.trim())}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Location not found.");
      setCoordinates([data.latitude, data.longitude]);
      setBase(data.label?.split(",")[0] || base.trim());
      setNotice("");
      trackPlannerEvent("planner_base_located", { destination_country: country });
    } catch (error) { setNotice(error instanceof Error ? error.message : "Location not found."); }
    finally { setBusy(false); }
  }

  async function createTrip(event: React.FormEvent) {
    event.preventDefault();
    if (!base.trim() || !coordinates) { setNotice("Choose your base and use Find base so we can show course distances."); return; }
    setBusy(true);
    try {
      const freshOwnerToken = crypto.randomUUID() + crypto.randomUUID();
      const response = await fetch("/api/trips", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ country, planner_user_id: plannerUserId || getPlannerUserId(country), trip_name: `${base.trim()} Golf Trip`, base_location: base.trim(), base_latitude: coordinates[0], base_longitude: coordinates[1], courses_wanted: target ? Number(target) : null, owner_token: freshOwnerToken }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.details || data.error || "Could not create trip.");
      trackPlannerEvent("planner_trip_created", {
        destination_country: country,
        course_target_set: Boolean(target),
      });
      setOwnerToken(freshOwnerToken);
      setTripId(data.trip_id);
      window.localStorage.setItem(tokenKey(country, data.trip_id), freshOwnerToken);
      window.localStorage.setItem(activeTripKey(country), data.trip_id);
      const destination = `${plannerRoute(country)}?tripId=${encodeURIComponent(data.trip_id)}`;
      if (window.location.pathname !== plannerRoute(country)) {
        window.location.assign(destination);
        return;
      }
      window.history.replaceState({}, "", destination);
      await loadTrip(data.trip_id, country, participantId || getParticipantId(country));
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not create trip."); }
    finally { setBusy(false); }
  }

  async function vote(courseId: number, choice: "up" | "down" | null) {
    const next = { ...votes };
    if (votes[courseId] === choice || choice === null) delete next[courseId]; else next[courseId] = choice;
    setVotes(next);
    const response = await fetch("/api/trips/vote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ trip_id: tripId, participant_id: participantId, course_id: courseId, vote: next[courseId] || null }) });
    const data = await response.json();
    if (response.ok) {
      setSummary(data.summary || {});
      setVotes(data.participant_votes || {});
      trackPlannerEvent("planner_vote_saved", {
        destination_country: country,
        vote_choice: next[courseId] || "cleared",
      });
    }
    else setNotice(data.details || data.error || "Vote could not be saved.");
  }

  async function addCourseToTrip(courseId: number) {
    const response = await fetch("/api/trips/add-course", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trip_id: tripId, course: { id: courseId } }),
    });
    const data = await response.json();
    if (!response.ok) { setNotice(data.error || "Course could not be added."); return; }
    setTrip((current) => current ? { ...current, selected_courses: data.selected_courses } : current);
    window.localStorage.setItem(activeCoursesKey(country), JSON.stringify(data.selected_courses));
    trackPlannerEvent("course_added_to_trip", {
      destination_country: country,
      shortlist_size: Array.isArray(data.selected_courses) ? data.selected_courses.length : 0,
      add_source: "planner_map",
    });
    setNotice("Course added to the shared shortlist.");
  }

  async function removeCourse(courseId: number) {
    if (!ownerToken && !legacyOwnerId) { setNotice("Only the organiser can remove courses. Open the trip on the organiser’s device."); return; }
    const response = await fetch("/api/trips/remove-course", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ trip_id: tripId, course_id: courseId, owner_token: ownerToken, legacy_owner_id: legacyOwnerId }) });
    const data = await response.json();
    if (!response.ok) { setNotice(data.error || "Course could not be removed."); return; }
    setTrip((current) => current ? { ...current, selected_courses: data.selected_courses } : current);
    window.localStorage.setItem(activeCoursesKey(country), JSON.stringify(data.selected_courses));
  }

  async function saveTripDetails() {
    if (!ownerToken) return;
    const response = await fetch("/api/trips", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ trip_id: tripId, trip_name: tripName, number_of_golfers: golfers ? Number(golfers) : null, owner_token: ownerToken }) });
    const data = await response.json();
    if (!response.ok) { setNotice(data.error || "Trip details could not be saved."); return; }
    setTrip((current) => current ? { ...current, trip_name: tripName, number_of_golfers: golfers ? Number(golfers) : undefined } : current);
    setNotice("Trip details saved.");
  }

  function startAnotherTrip() {
    window.localStorage.removeItem(activeTripKey(country));
    setTrip(null);
    setTripId("");
    setQueryTrip("");
    setTripName("");
    setBase("");
    setTarget("");
    setCoordinates(null);
    setNotice("");
    window.history.replaceState({}, "", plannerRoute(country));
  }

  async function share(mode: "whatsapp" | "email" | "copy" | "more") {
    const url = `${window.location.origin}${window.location.pathname}?tripId=${encodeURIComponent(tripId)}`;
    const message = `Join ${trip?.trip_name || `${base} Golf Trip`} on GuestPlayGolf: ${url}`;
    trackPlannerEvent("planner_share_action", {
      destination_country: country,
      share_method: mode,
    });
    if (mode === "whatsapp") { window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer"); return; }
    if (mode === "email") { window.location.href = `mailto:?subject=${encodeURIComponent(trip?.trip_name || "Golf trip shortlist")}&body=${encodeURIComponent(message)}`; return; }
    if (mode === "more" && navigator.share) { await navigator.share({ title: trip?.trip_name || "Golf trip shortlist", text: message, url }); return; }
    await navigator.clipboard.writeText(url);
    setNotice("Trip link copied. Send it to your group so they can add courses and vote.");
    setShareOptions(false);
  }

  function renderCourse(course: TripCourse, shortlisted = false) {
    const returnParams = new URLSearchParams();
    if (tripId) returnParams.set("tripId", tripId);
    if (search) returnParams.set("search", search);
    prices.forEach((price) => returnParams.append("price", price));
    if (courseType) returnParams.set("courseType", courseType);
    if (region) returnParams.set("region", region);
    if (holes) returnParams.set("holes", holes);
    if (access) returnParams.set("access", access);
    if (radius) returnParams.set("radius", radius);
    if (view === "map") returnParams.set("view", "map");
    const returnTo = `${plannerRoute(country)}${returnParams.size ? `?${returnParams.toString()}` : ""}`;
    const courseHref = `/courses/${course.id}?${new URLSearchParams({ country: country.toLowerCase(), source: "planner", planner: "true", ...(tripId ? { tripId } : {}), returnTo }).toString()}`;
    return <article key={course.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><Link href={courseHref} className="text-lg font-bold text-slate-900 hover:text-emerald-800">{course.course_name}</Link><p className="mt-1 text-sm text-slate-600">{[course.town, course.region].filter(Boolean).join(", ")} · {course.distance != null ? `${course.distance.toFixed(1)} km` : "Distance unavailable"}</p><p className="mt-2 text-sm text-slate-600">{course.price_range || "Price band unavailable"}{course.holes ? ` · ${course.holes} holes` : ""}{course.course_type ? ` · ${course.course_type}` : ""}</p></div>
      {shortlisted ? <div className="flex items-center gap-2" aria-label={`Votes for ${course.course_name}`}><button type="button" aria-pressed={votes[course.id] === "up"} onClick={() => void vote(course.id, "up")} className={`rounded-full border px-3 py-2 font-semibold ${votes[course.id] === "up" ? "bg-emerald-800 text-white" : "border-emerald-300 text-emerald-900"}`}>👍 {summary[course.id]?.up || 0}</button><button type="button" aria-pressed={votes[course.id] === "down"} onClick={() => void vote(course.id, "down")} className={`rounded-full border px-3 py-2 font-semibold ${votes[course.id] === "down" ? "bg-rose-700 text-white" : "border-rose-200 text-rose-800"}`}>👎 {summary[course.id]?.down || 0}</button>{(ownerToken || legacyOwnerId) && <button type="button" onClick={() => void removeCourse(course.id)} className="rounded-full border border-slate-300 px-3 py-2 text-sm">Remove</button>}</div> : <CourseCard id={course.id} country={country} course_name={course.course_name} town={course.town || ""} region={course.region || ""} holes={course.holes ?? undefined} independent_guest_days={course.independent_guest_days || undefined} season={course.season || undefined} price_range={course.price_range || undefined} course_type={course.course_type || undefined} course_image={course.course_image || undefined} distance={course.distance || undefined} latitude={course.latitude || undefined} longitude={course.longitude || undefined} max_handicap={course.max_handicap || undefined} searchParams={{ country: country.toLowerCase(), source: "planner", planner: "true", ...(tripId ? { tripId } : {}), returnTo }} />}</div>
      <p className="mt-2 text-xs text-slate-500">Net votes: {summary[course.id]?.score || 0}</p>
    </article>;
  }

  if (!trip) return <main className="min-h-screen bg-stone-100 px-4 py-8 text-slate-800"><div className="mx-auto max-w-5xl"><Link href="/" className="text-sm font-semibold text-emerald-800">← GuestPlayGolf</Link><section className="mt-5 rounded-3xl bg-emerald-950 p-6 text-white sm:p-9"><p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-200">Free collaborative golf trip shortlist</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">Plan your golf trip</h1><p className="mt-3 max-w-2xl text-emerald-50">Choose where you’re staying, discover courses on a map, invite your group and vote together.</p></section>
    <form onSubmit={(event) => void createTrip(event)} className="mt-5 grid gap-4 rounded-3xl bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-7"><label className="text-sm font-semibold">Destination<select className="mt-1 block w-full rounded-xl border border-slate-300 p-3" value={country} onChange={(e) => { const selected = e.target.value as Country; setCountry(selected); setParticipantId(getParticipantId(selected)); setLegacyOwnerId(window.localStorage.getItem(legacyOwnerKey(selected)) || ""); const ownerId = getPlannerUserId(selected); setPlannerUserId(ownerId); void loadSavedTrips(ownerId); setCoordinates(null); }}>{(["Ireland", "Switzerland", "Portugal"] as Country[]).map((c) => <option key={c}>{c}</option>)}</select></label><label className="text-sm font-semibold">Where are you staying?<input list="planner-bases" className="mt-1 block w-full rounded-xl border border-slate-300 p-3" value={base} onChange={(e) => { setBase(e.target.value); setCoordinates(null); }} placeholder={presets[country].bases[0]} required /><datalist id="planner-bases">{presets[country].bases.map((b) => <option key={b} value={b} />)}</datalist></label><div className="flex items-end"><button type="button" onClick={() => void locateBase()} disabled={!base.trim() || busy} className="rounded-xl border border-emerald-800 px-5 py-3 font-semibold text-emerald-900 disabled:opacity-50">{coordinates ? "Base located ✓" : "Find base"}</button></div><label className="text-sm font-semibold">How many courses do you want to play? <span className="font-normal text-slate-500">(optional)</span><input type="number" min="1" max="14" className="mt-1 block w-full rounded-xl border border-slate-300 p-3" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Choose later" /></label><div className="sm:col-span-2"><button disabled={busy} className="rounded-full bg-emerald-800 px-7 py-3 font-bold text-white disabled:opacity-50">{busy ? "Setting up…" : "Start discovering courses"}</button>{notice && <p role="alert" className="mt-3 text-sm text-rose-700">{notice}</p>}{queryTrip && <p className="mt-3 text-sm text-slate-600">Loading shared trip…</p>}</div></form>{savedTrips.length > 0 && <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm"><h2 className="text-xl font-bold">Your saved trips</h2><div className="mt-3 grid gap-2 sm:grid-cols-2">{savedTrips.map((saved) => <button key={saved.trip_id} type="button" onClick={() => void openSavedTrip(saved.trip_id, tripCountry(saved.country || null, country))} className="rounded-2xl border border-slate-200 p-4 text-left hover:border-emerald-700"><span className="block font-semibold text-slate-900">{saved.trip_name}</span><span className="mt-1 block text-sm text-slate-600">{saved.base_location} · {(saved.selected_courses || []).length} courses · {saved.country || country}</span></button>)}</div></section>}</div></main>;

  const priceBands = country === "Switzerland" ? [...new Set(courses.map((c) => c.price_range).filter((x): x is string => Boolean(x)))].sort() : ["€", "€€", "€€€", "€€€€", "€€€€€"];
  return <main className="min-h-screen bg-stone-100 px-4 py-6 text-slate-800"><div className="mx-auto max-w-7xl"><div className="flex items-center justify-between gap-3"><Link href={country === "Portugal" ? "/golf-courses-algarve" : country === "Switzerland" ? "/switzerland" : "/ireland"} className="text-sm font-semibold text-emerald-800">← Explore golf in {country}</Link><button type="button" onClick={startAnotherTrip} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">Start another trip</button></div><section className="mt-4 rounded-3xl bg-emerald-950 p-5 text-white sm:p-7"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-200">My Trip</p><h1 className="mt-1 text-3xl font-bold">{trip.trip_name}</h1><p className="mt-2 text-emerald-50">Base: {trip.base_location}{trip.courses_wanted ? ` · ${trip.courses_wanted} courses wanted` : ""}</p>{ownerToken && <div className="mt-3 flex flex-wrap items-end gap-2"><label className="text-xs font-semibold text-emerald-50">Trip name<input className="mt-1 block rounded-xl border border-white/30 bg-white px-3 py-2 text-sm text-slate-900" value={tripName} onChange={(e) => setTripName(e.target.value)} /></label><label className="text-xs font-semibold text-emerald-50">Golfers (optional)<input type="number" min="1" max="32" className="mt-1 block w-24 rounded-xl border border-white/30 bg-white px-3 py-2 text-sm text-slate-900" value={golfers} onChange={(e) => setGolfers(e.target.value)} placeholder="Later" /></label><button type="button" onClick={() => void saveTripDetails()} className="rounded-xl border border-white/50 px-4 py-2 text-sm font-semibold text-white">Save details</button></div>}</div><button type="button" onClick={() => setShareOptions((open) => !open)} aria-expanded={shareOptions} className="relative rounded-full bg-white px-5 py-3 font-bold text-emerald-950">Share Trip</button>{shareOptions && <div className="absolute right-4 z-20 mt-14 grid min-w-48 gap-1 rounded-2xl bg-white p-2 text-slate-900 shadow-xl"><button type="button" onClick={() => void share("whatsapp")} className="rounded-xl px-3 py-2 text-left hover:bg-emerald-50">WhatsApp</button><button type="button" onClick={() => void share("email")} className="rounded-xl px-3 py-2 text-left hover:bg-emerald-50">Email</button><button type="button" onClick={() => void share("copy")} className="rounded-xl px-3 py-2 text-left hover:bg-emerald-50">Copy link</button>{typeof navigator !== "undefined" && "share" in navigator && <button type="button" onClick={() => void share("more")} className="rounded-xl px-3 py-2 text-left hover:bg-emerald-50">More sharing options</button>}</div>}</div><div className="mt-5 flex flex-wrap gap-3 text-sm"><span className="rounded-full bg-white/10 px-4 py-2">{tripCourses.length} shortlisted</span><span className="rounded-full bg-white/10 px-4 py-2">{Object.values(summary).reduce((n, x) => n + (x.up || 0) + (x.down || 0), 0)} votes</span><span className="rounded-full bg-white/10 px-4 py-2">Estimated green fees per golfer: {estimate.length ? `${presets[country].currency}${low}${openEndedEstimate ? "+" : `–${presets[country].currency}${high}`}` : "add courses with price bands"}</span>{golfers && estimate.length > 0 && <span className="rounded-full bg-white/10 px-4 py-2">Group estimate: {presets[country].currency}{low * Number(golfers)}{openEndedEstimate ? "+" : `–${presets[country].currency}${high * Number(golfers)}`}</span>}</div><p className="mt-2 text-xs text-emerald-100">Illustrative price band estimate for leading courses; actual fees vary by date and availability.</p></section>
    {notice && <p role="status" className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-950">{notice}</p>}
    <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.2fr]"><div className="space-y-5"><div className="rounded-3xl bg-white p-5 shadow-sm"><h2 className="text-xl font-bold">Leading courses <span className="text-sm font-normal text-slate-500">(top {targetCount})</span></h2><div className="mt-4 space-y-3">{leaders.length ? leaders.map((c) => renderCourse(c, true)) : <p className="text-sm text-slate-600">No courses yet. Add options from the discovery list.</p>}</div></div>{otherShortlist.length > 0 && <div className="rounded-3xl bg-white p-5 shadow-sm"><h2 className="text-xl font-bold">Other shortlisted courses</h2><div className="mt-4 space-y-3">{otherShortlist.map((c) => renderCourse(c, true))}</div></div>}</div>
    <div className="rounded-3xl bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-bold">Discover nearby courses</h2><p className="mt-1 text-sm text-slate-600">Add any course in {country}; straight-line distance is shown from {trip.base_location}.</p></div><button type="button" aria-pressed={view === "map"} onClick={() => setView((current) => current === "map" ? "list" : "map")} className={`rounded-full border px-4 py-2 text-sm font-semibold ${view === "map" ? "bg-emerald-800 text-white" : "border-emerald-800 text-emerald-800"}`}>{view === "map" ? "Hide map" : "Show map"}</button></div>
    <div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-sm font-semibold">Search<input className="mt-1 block w-full rounded-xl border border-slate-300 p-2.5" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Course, town or region" /></label><label className="text-sm font-semibold">Course type<select className="mt-1 block w-full rounded-xl border border-slate-300 p-2.5" value={courseType} onChange={(e) => setCourseType(e.target.value)}><option value="">Any type</option>{types.map((type) => <option key={type}>{type}</option>)}</select></label><label className="text-sm font-semibold">Area<select className="mt-1 block w-full rounded-xl border border-slate-300 p-2.5" value={region} onChange={(e) => setRegion(e.target.value)}><option value="">All areas</option>{regions.map((item) => <option key={item}>{item}</option>)}</select></label><label className="text-sm font-semibold">Holes<select className="mt-1 block w-full rounded-xl border border-slate-300 p-2.5" value={holes} onChange={(e) => setHoles(e.target.value)}><option value="">Any</option>{holeCounts.map((count) => <option key={count} value={count}>{count} holes</option>)}</select></label><label className="text-sm font-semibold">Visitor access<select className="mt-1 block w-full rounded-xl border border-slate-300 p-2.5" value={access} onChange={(e) => setAccess(e.target.value)}><option value="">Any access</option>{accessOptions.map((item) => <option key={item} value={item}>{item === "Weekend" ? "Weekends" : item === "Everyday" ? "Every day" : item}</option>)}</select></label><label className="text-sm font-semibold">Distance<select className="mt-1 block w-full rounded-xl border border-slate-300 p-2.5" value={radius} onChange={(e) => setRadius(e.target.value)}><option value="">Any distance</option>{[10, 25, 50, 75, 100, 150].map((km) => <option key={km} value={km}>Within {km} km</option>)}</select></label></div>
    <fieldset className="mt-4"><legend className="text-sm font-semibold">Price bands <span className="font-normal text-slate-500">(choose more than one)</span></legend><div className="mt-2 flex flex-wrap gap-2">{priceBands.map((band) => <label key={band} className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm"><input type="checkbox" checked={prices.includes(band)} onChange={() => setPrices((current) => current.includes(band) ? current.filter((p) => p !== band) : [...current, band])} />{displayBand(country, band)}</label>)}</div></fieldset>
    <p className="mt-4 text-sm text-slate-600">{filtered.length} courses · distance from base is straight-line distance.</p><div className="mt-3">{view === "map" && <div className="mb-5"><CourseMap courses={[...tripCourses, ...filtered.filter((c) => !tripCourses.some((tripCourse) => tripCourse.id === c.id))]} highlightedCourseIds={tripCourses.map((course) => course.id)} onAddCourse={(courseId) => void addCourseToTrip(courseId)} initialCenter={coordinates || presets[country].center} /></div>}<div className="grid gap-3">{filtered.slice(0, 80).map((c) => <div key={c.id}>{renderCourse(c, false)}</div>)}</div>{filtered.length > 80 && <p className="mt-3 text-sm text-slate-500">Refine the filters to narrow these results.</p>}</div>
    </div></section><footer className="mt-7 text-xs text-slate-500">Invited guests can add courses and vote. Only the organiser can remove shortlisted courses. Equal vote totals remain tied.</footer></div></main>;
}
