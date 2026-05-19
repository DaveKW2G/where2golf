import type { Metadata } from "next"
import Link from "next/link"
import IrelandPageClient from "@/components/IrelandPageClient"

const siteUrl = "https://guestplaygolf.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Golf in Ireland | Best courses for visiting and non-members",
  description:
    "Discover where to play golf in Ireland. Explore links, parkland and heathland courses, regional golf guides and the best places for visiting golfers.",
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
    title: "Golf near Adare Manor",
    href: "/golf-near-adare-manor",
    description:
      "Plan golf around Adare Manor and the Ryder Cup region, with access to Clare, Kerry and world-class west coast links.",
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

const priceCategories = [
  {
    label: "€",
    range: "Value",
    description:
      "Strong-value golf options, typically offering accessible green fees and excellent local golf experiences.",
  },
  {
    label: "€€",
    range: "Mid-range",
    description:
      "A balance of quality, visitor experience and price across many established clubs and resorts.",
  },
  {
    label: "€€€",
    range: "Premium",
    description:
      "Championship venues, stronger resort experiences and highly regarded visitor golf destinations.",
  },
  {
    label: "€€€€",
    range: "Bucket-list",
    description:
      "Iconic, destination golf experiences that sit among Ireland’s most memorable and sought-after courses.",
  },
]

export default function IrelandPage() {
  return (
    <main className="min-h-screen bg-stone-100 text-slate-800">
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

            <Link href="/about" className="text-[13px] text-white/85 no-underline">
              About
            </Link>
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
              courses to accessible parkland and heathland layouts. Compare
              regions, course style, price, access and distance to plan where to
              play next.
            </p>

            <p className="mt-4 text-[15px] font-medium text-white">
              Golf isn’t easy. Finding where to play should be.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[480px] px-5 py-6">
        <IrelandPageClient />

        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-[18px] font-semibold text-slate-900">
            Planning golf in Ireland
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            Ireland is one of the richest golf destinations in the world. The
            challenge is not whether there are enough courses — it is choosing
            the right ones for your trip, budget, location and playing style.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            GuestPlayGolf helps visiting golfers compare courses more clearly,
            including course type, guest access, handicap information, price
            level, seasonality and distance from key golf destinations.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            Ireland is generally more visitor-friendly than many restricted golf
            markets, but access still varies by course. Some clubs welcome
            visitors most days, some prioritise weekdays, and some resort courses
            may be easier to access as part of a stay-and-play experience.
          </p>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-[18px] font-semibold text-slate-900">
            Golf near major Irish destinations
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Start with key locations that give access to Ireland’s strongest golf
            regions, major airports and well-known golf travel routes.
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

        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-[18px] font-semibold text-slate-900">
            Types of golf courses in Ireland
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Ireland is best understood through three main course styles. Knowing
            the difference makes it easier to choose the right course for your
            trip.
          </p>

          <div className="mt-4 space-y-4 text-sm leading-6 text-slate-700">
            <div>
              <h3 className="font-semibold text-slate-900">Links courses</h3>
              <p className="mt-1">
                Coastal courses built on sandy, natural terrain, often with firm
                fairways, dunes, uneven lies and exposed wind conditions. Links
                golf is Ireland’s most famous style and is especially strong
                along the Atlantic coast and around major coastal regions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">Parkland courses</h3>
              <p className="mt-1">
                Inland courses usually shaped through trees, softer ground,
                lakes, rivers and more sheltered surroundings. Parkland courses
                are often more familiar to visiting golfers and can be a strong
                choice when looking for playable, scenic and accessible golf.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">Heathland courses</h3>
              <p className="mt-1">
                Open inland courses with a more natural and exposed feel than
                traditional parkland. Heathland layouts often include firmer
                turf, strategic bunkering, wind influence and links-style
                features without being true coastal links courses.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-[18px] font-semibold text-slate-900">
            Understanding price categories
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            GuestPlayGolf uses simple price categories to help visiting golfers
            compare courses more quickly. These are designed to indicate the
            general golf experience and pricing level, rather than exact live
            green fees, which can vary by season, day and booking type.
          </p>

          <div className="mt-4 grid gap-3">
            {priceCategories.map((category) => (
              <div
                key={category.label}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="text-[20px] font-bold text-emerald-800">
                    {category.label}
                  </div>

                  <div className="text-sm font-semibold text-slate-900">
                    {category.range}
                  </div>
                </div>

                <p className="mt-2 text-sm leading-5 text-slate-600">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-[18px] font-semibold text-slate-900">
            Why use GuestPlayGolf in Ireland
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            Ireland has an incredible number of golf courses, but choosing where
            to play can be overwhelming. Options vary by region, course type,
            price, visitor access and availability.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            GuestPlayGolf is built to make that decision easier. Instead of only
            listing courses, we focus on practical golf planning information:
            where visitors can play, what type of course it is, how accessible it
            is, and what to expect before booking.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            Our goal is simple: help golfers identify where they can play next.
          </p>

          <Link
            href="/about"
            className="mt-4 inline-block rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white no-underline"
          >
            About GuestPlayGolf
          </Link>
        </div>
      </section>
    </main>
  )
}