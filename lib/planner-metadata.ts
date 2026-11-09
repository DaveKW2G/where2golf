import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export async function getPlannerMetadata(country: "Ireland" | "Switzerland" | "Portugal", tripId?: string): Promise<Metadata> {
  const slug = country === "Ireland" ? "ireland" : country === "Portugal" ? "portugal" : "switzerland";
  const canonical = `https://guestplaygolf.com/${slug}/planner`;
  let tripName = "";
  if (tripId) {
    const supabase = await createClient();
    const { data } = await supabase.rpc("planner_v2_get_trip", { p_trip_id: tripId });
    if (data) tripName = String(data.trip_name || `${data.base_location} Golf Trip`).slice(0, 100);
  }
  const title = tripName ? `${tripName} | GuestPlayGolf` : `${country} Golf Trip Shortlist | GuestPlayGolf`;
  const description = tripName
    ? `Join ${tripName} on GuestPlayGolf. Explore courses, add options and vote together.`
    : `Choose your base, discover ${country} golf courses, build a shared shortlist and vote with your group.`;
  const url = tripId ? `${canonical}?tripId=${encodeURIComponent(tripId)}` : canonical;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url, siteName: "GuestPlayGolf", type: "website", images: ["/og-image.jpg"] },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.jpg"] },
  };
}
