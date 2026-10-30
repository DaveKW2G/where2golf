import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Vote on a Golf Trip | GuestPlayGolf",
  description:
    "Vote on the courses for a shared golf trip and suggest any options the group has missed.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://guestplaygolf.com/ireland/planner/vote",
  },
  openGraph: {
    title: "Help Choose the Courses | GuestPlayGolf",
    description:
      "You have been invited to vote on a golf trip and suggest any courses the group has missed.",
    url: "https://guestplaygolf.com/ireland/planner/vote",
    siteName: "GuestPlayGolf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Help Choose the Courses | GuestPlayGolf",
    description:
      "Vote on a shared golf trip and suggest any courses the group has missed.",
  },
};

export default function TripVoteLayout({ children }: { children: ReactNode }) {
  return children;
}
