'use client'

import { useEffect } from 'react'

type Props = {
  courseName: string
  courseId: number
  region: string
}

export default function CourseViewTracker({
  courseName,
  courseId,
  region,
}: Props) {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'course_view', {
        course_name: courseName,
        course_id: courseId,
        region: region,
      })
    }
  }, [courseName, courseId, region])

  return null
}