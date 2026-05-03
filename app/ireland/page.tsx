import type { Metadata } from "next"
import Link from "next/link"

const siteUrl = "https://guestplaygolf.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Golf in Ireland | Best courses for visiting and non-members",
  description:
    "Discover where to play golf in Ireland. Explore links and parkland courses, regional golf guides and the best places for visiting golfers.",
  alternates: {
    canonical: "/ireland",
  },
  openGraph: {
    title: "Golf in Ireland | GuestPlayGolf",
    description:
      "Explore where to play golf in Ireland, including links, parkland and top regions for visiting golfers.",
    url: `${siteUrl}/ireland`,
    siteName: "GuestPlayGolf",
    type: "website",
  },
}

const popularDestinations = [
  {
    title: "Golf near Dublin",
    href: "/golf-near-dublin",
    description:
      "The busiest golf region in Ireland, with a mix of top links and parkland courses within easy reach.",
  },
  {
    title: "Golf near Cork",
    href: "/golf-near-cork",
    description:
      "Access to some of Ireland’s best coastal golf, with famous links courses and scenic parkland options.",
  },
  {
    title: "Golf near Galway",
    href: "/golf-near-galway",
    description:
      "A gateway to the west of Ireland, with world-class links courses and dramatic coastal golf.",
  },
  {
    title: "Golf near Belfast",
    href: "/golf-near-belfast",
    description:
      "Home to some of the best links golf in the world, including Royal County Down and surrounding courses.",
  },
]

export default function IrelandPage() {
  return (
    <main className="min-h-screen bg-stone-100 text-slate-800">
      {/* HERO */}
      <section className="relative overflow-hidden px-5 pb-8 pt-5 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1505842465776-3d90f6163108?q=80&w=1600&auto=format&fit=crop')",
          }}
        />

        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/90 via-emerald-900/80 to-emerald-800/90" />

        <div className="relative z-10 mx-auto max-w-[480px]">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-white no-underline">
              ← Back
            </Link>

            <div className="text-[13px] uppercase tracking-wide text-white/80">
              GuestPlayGolf
            </div>

            <div className="w-10" />
          </div>

          <div className="mt-5">
            <p className="text-[12px] uppercase tracking-wide text-white/70">
              Ireland
            </p>

            <h1 className="mt-2 text-[26px] font-bold leading-tight">
              Golf in Ireland for visiting and non-members
            </h1>

            <p className="mt-4 text-[15px] leading-6 text-white/85">
              Discover where to play golf in Ireland, from world-famous links
              courses to accessible parkland layouts. Explore regions, compare
              course styles and plan where to play next.
            </p>

            <p className="mt-4 text-[15px] font-medium text-white">
              Ireland is one of the best golf destinations in the world — the
              challenge is choosing where to play.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[480px] px-5 py-6">
        {/* PLANNING */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-[18px] font-semibold text-slate-900">
            Planning golf in Ireland
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            Ireland offers one of the richest golf experiences in the world.
            From rugged Atlantic links to tree-lined inland courses, the variety
            is exceptional and accessible for visiting golfers.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            Links golf is the defining experience, especially along the west and
            south coasts, with natural terrain, coastal winds and firm playing
            conditions. Parkland golf is more common inland, offering a more
            sheltered and consistent playing style.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            Most courses in Ireland welcome visitors, making it much easier to
            plan golf compared to more restricted markets. The key decision is
            less about access, and more about choosing the right region, course
            style and travel route.
          </p>
        </div>

        {/* DESTINATIONS */}
        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-[18px] font-semibold text-slate-900">
            Golf near major Irish cities
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Start with key locations that give access to the best golf regions
            and travel connections across Ireland.
          </p>

          <div className="mt-4 grid gap-3">
            {popularDestinations.map((destination) => (
              <Link
                key={destination.href}
                href={destination.href}
                className="block rounded-2xl bg-emerald-800 px-5 py-5 text-white no-underline shadow-sm hover:bg-emerald-900"
              >
                <div className="text-[17px] font-semibold">
                  {destination.title}
                </div>
                <p className="mt-1 text-sm leading-5 text-white/85">
                  {destination.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* COURSE TYPES */}
        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-[18px] font-semibold text-slate-900">
            Types of golf in Ireland
          </h2>

          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            <li>
              • Links courses — coastal, natural terrain, firm fairways and
              wind-exposed conditions
            </li>
            <li>
              • Parkland courses — inland layouts with trees, softer ground and
              more consistent conditions
            </li>
            <li>
              • Championship courses — high-profile venues often hosting major
              events
            </li>
            <li>
              • Local clubs — accessible courses with strong value and easier
              availability
            </li>
          </ul>
        </div>

        {/* WHY */}
        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-[18px] font-semibold text-slate-900">
            Why use GuestPlayGolf in Ireland
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            Ireland has an incredible number of golf courses, but choosing where
            to play can be overwhelming. Options vary by region, course type,
            price and availability.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            GuestPlayGolf helps you cut through that choice by focusing on where
            you can actually play, how courses compare and what to expect before
            booking.
          </p>
        </div>
      </section>
    </main>
  )
}