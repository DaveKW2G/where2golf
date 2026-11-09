import PlannerV2 from "@/components/PlannerV2";
import { getPlannerCourses } from "@/lib/planner-courses";
import { getPlannerMetadata } from "@/lib/planner-metadata";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ tripId?: string }> }) {
  return getPlannerMetadata("Portugal", (await searchParams).tripId);
}

export default async function PortugalPlannerPage() {
  const { courses } = await getPlannerCourses("Portugal");
  return <PlannerV2 country="Portugal" courses={courses} />;
}
