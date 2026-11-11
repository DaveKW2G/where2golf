const courseReturnKey = (courseId: number) => `gpg:course-return:${courseId}`;

export function rememberCourseReturnTo(courseId: number, fallbackHref?: string) {
  if (typeof window === "undefined") return;

  const returnTo = fallbackHref || `${window.location.pathname}${window.location.search}`;
  if (!returnTo.startsWith("/") || returnTo.startsWith("//")) return;

  try {
    window.sessionStorage.setItem(courseReturnKey(courseId), returnTo);
  } catch {
    // Back navigation still has a country-level fallback if storage is unavailable.
  }
}

export function consumeCourseReturnTo(courseId: number) {
  if (typeof window === "undefined") return null;

  try {
    const returnTo = window.sessionStorage.getItem(courseReturnKey(courseId));
    window.sessionStorage.removeItem(courseReturnKey(courseId));

    return returnTo?.startsWith("/") && !returnTo.startsWith("//")
      ? returnTo
      : null;
  } catch {
    return null;
  }
}
