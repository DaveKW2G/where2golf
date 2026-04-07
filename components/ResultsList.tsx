import CourseCard from "./CourseCard"

interface ResultsListProps {
  courses: any[]
  userLat?: number | null
  userLng?: number | null
}

export default function ResultsList({ courses, userLat, userLng }: ResultsListProps) {

  if (!courses || courses.length === 0) {
    return (
      <div className="mt-8 rounded-2xl bg-white p-6 text-center shadow-sm">
        No matching courses found.
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          {...course}
          userLat={userLat}
          userLng={userLng}
        />
      ))}
    </div>
  )
}