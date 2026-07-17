import type { Metadata } from "next";
import type { ReactNode } from "react";

const siteUrl = "https://guestplaygolf.com";

export const metadata: Metadata = {
  title: "Free Irish Golf Trip Planner | Plan, Share & Vote",
  description:
    "Plan your Irish golf trip for free. Explore 100+ courses, build your itinerary, share it with friends and vote together on where to play.",
  alternates: {
    canonical: `${siteUrl}/ireland/planner`,
  },
  openGraph: {
    title: "Free Irish Golf Trip Planner | Plan, Share & Vote",
    description:
      "Explore 100+ Irish golf courses, build your itinerary, share it with friends and vote together on where to play.",
    url: `${siteUrl}/ireland/planner`,
    siteName: "GuestPlayGolf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Irish Golf Trip Planner | Plan, Share & Vote",
    description:
      "Explore 100+ Irish golf courses, build your itinerary, share it with friends and vote together on where to play.",
  },
};

export default function IrelandPlannerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}