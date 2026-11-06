'use client'

import dynamic from 'next/dynamic'

type Course = {
  id: number
  course_name: string
  latitude: number
  longitude: number
  town: string
  region: string
}

type Props = {
  courses: Course[]
}

const CourseMap = dynamic<Props>(() => import('@/components/CourseMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-stone-100 text-sm font-semibold text-slate-600">
      Loading course map…
    </div>
  ),
})

export default function CourseMapLoader({ courses }: Props) {
  return <CourseMap courses={courses} />
}
