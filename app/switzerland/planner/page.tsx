import PlannerV2 from "@/components/PlannerV2";
import { getPlannerCourses } from "@/lib/planner-courses";
import { getPlannerMetadata } from "@/lib/planner-metadata";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ tripId?: string }> }) {
  return getPlannerMetadata("Switzerland", (await searchParams).tripId);
}

export default async function SwitzerlandPlannerPage() {
  const { courses } = await getPlannerCourses("Switzerland");
  return <PlannerV2 country="Switzerland" courses={courses} />;
}
