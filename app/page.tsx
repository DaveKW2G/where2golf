import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";

const siteUrl = "https://guestplaygolf.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "GuestPlayGolf | Find Courses & Plan Golf Trips",
  description:
    "Find golf courses you can play as a visiting golfer or independent guest. Compare courses in Ireland, Switzerland and Portugal, then plan better golf trips with GuestPlayGolf.",
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
