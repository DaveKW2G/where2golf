import { redirect } from "next/navigation";

export default async function LegacyTripVotePage({ searchParams }: { searchParams: Promise<{ tripId?: string }> }) {
  const { tripId } = await searchParams;
  if (tripId) redirect(`/ireland/planner?tripId=${encodeURIComponent(tripId)}`);
  redirect("/ireland/planner");
}
