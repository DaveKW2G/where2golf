import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Switzerland Golf Trip Shortlist | GuestPlayGolf",
  description: "Choose your base, discover Swiss golf courses on a map, build a shared shortlist and vote with your group.",
  alternates: { canonical: "https://guestplaygolf.com/switzerland/planner" },
  openGraph: {
    title: "Switzerland Golf Trip Shortlist | GuestPlayGolf",
    description: "Explore Swiss golf courses, build a shared shortlist, invite friends and vote together.",
    url: "https://guestplaygolf.com/switzerland/planner",
    siteName: "GuestPlayGolf",
    type: "website",
  },
};

export default function SwitzerlandPlannerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
