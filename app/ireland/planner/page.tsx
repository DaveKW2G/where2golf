import PlannerV2 from "@/components/PlannerV2";
import { getPlannerCourses } from "@/lib/planner-courses";
import { getPlannerMetadata } from "@/lib/planner-metadata";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ tripId?: string }> }) {
  return getPlannerMetadata("Ireland", (await searchParams).tripId);
}

export default async function IrelandPlannerPage() {
  const { courses } = await getPlannerCourses("Ireland");
  return <PlannerV2 country="Ireland" courses={courses} />;
}
