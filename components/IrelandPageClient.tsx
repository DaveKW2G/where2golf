"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";

const countyOptions = [
  {
    label: "Clare",
    href: "/golf-courses-clare",
  },
  {
    label: "Cork",
    href: "/golf-courses-cork",
  },
  {
    label: "Donegal",
    href: "/golf-courses-donegal",
  },
  {
    label: "Down",
    href: "/golf-courses-down",
  },
  {
    label: "Dublin",
    href: "/golf-courses-dublin",
  },
  {
    label: "Galway",
    href: "/golf-courses-galway",
  },
  {
    label: "Kerry",
    href: "/golf-courses-kerry",
  },
  {
    label: "Kildare",
    href: "/golf-courses-kildare",
  },
  {
    label: "Limerick",
    href: "/golf-courses-limerick",
  },
  {
    label: "Wicklow",
    href: "/golf-courses-wicklow",
  },
];

export default function IrelandPageClient() {
  const router = useRouter();

  function handleNearMe() {
    if (!navigator.geolocation) {
      alert(
        "Geolocation is not supported by your browser.",
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        router.push(
          `/results?lat=${lat}&lng=${lng}&country=Ireland&source=ireland`,
        );
      },
      () => {
        alert(
          "Location access was denied. Please allow location access in your browser settings.",
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }

  function handleCountyChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    const href = event.target.value;

    if (href) {
      router.push(href);
    }
  }

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
      <h2 className="text-[18px] font-semibold text-slate-900">
        Find golf in Ireland
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        Use GuestPlayGolf to search Irish courses by
        location, course type, guest access, price and
        distance.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Link
          href="/filters?country=Ireland&source=ireland"
          className="block rounded-2xl bg-emerald-800 px-5 py-4 text-white no-underline shadow-sm"
        >
          <div className="font-semibold">
            Advanced Search
          </div>

          <p className="mt-1 text-sm leading-5 text-white/85">
            Filter Irish courses by location, course
            type, guest access, holes and price.
          </p>
        </Link>

        <button
          type="button"
          onClick={handleNearMe}
          className="rounded-2xl bg-white px-5 py-4 text-left text-slate-900 shadow-sm ring-1 ring-slate-200"
        >
          <div className="font-semibold">
            Find golf near me
          </div>

          <p className="mt-1 text-sm leading-5 text-slate-600">
            Use your location to find nearby Irish
            golf courses.
          </p>
        </button>

        <Link
          href="/results?country=Ireland&source=ireland"
          className="block rounded-2xl bg-white px-5 py-4 text-slate-900 no-underline shadow-sm ring-1 ring-slate-200"
        >
          <div className="font-semibold">
            Browse Ireland courses
          </div>

          <p className="mt-1 text-sm leading-5 text-slate-600">
            View all Irish courses without applying
            filters.
          </p>
        </Link>

        <div className="rounded-2xl bg-white px-5 py-4 text-slate-900 shadow-sm ring-1 ring-slate-200">
          <div className="font-semibold">
            Browse by County
          </div>

          <p className="mt-1 text-sm leading-5 text-slate-600">
            Choose a county to explore its golf
            courses.
          </p>

          <select
            defaultValue=""
            onChange={handleCountyChange}
            className="mt-3 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-700"
          >
            <option value="" disabled>
              Select county
            </option>

            {countyOptions.map((county) => (
              <option
                key={county.href}
                value={county.href}
              >
                {county.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}