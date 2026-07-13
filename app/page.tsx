import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";

const siteUrl = "https://guestplaygolf.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "GuestPlayGolf | Find Courses & Plan Golf Trips",
  description:
    "Find golf courses you can play as a visiting golfer or independent guest. Compare Ireland and Switzerland golf courses, then use our free Ireland golf trip planner to build, share and vote on your itinerary.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "GuestPlayGolf | Find Courses & Plan Golf Trips",
    description:
      "Find golf courses you can play, compare visitor access and plan better golf trips with GuestPlayGolf.",
    url: siteUrl,
    siteName: "GuestPlayGolf",
    type: "website",
  },
};

export default function HomePage() {
  return <HomePageClient />;
}