"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { rememberCourseReturnTo } from "@/lib/course-navigation";

type CourseNavigationLinkProps = {
  courseId: number;
  className?: string;
  children: ReactNode;
};

export default function CourseNavigationLink({
  courseId,
  className,
  children,
}: CourseNavigationLinkProps) {
  return (
    <Link
      href={`/courses/${courseId}`}
      className={className}
      onClick={() => rememberCourseReturnTo(courseId)}
    >
      {children}
    </Link>
  );
}
