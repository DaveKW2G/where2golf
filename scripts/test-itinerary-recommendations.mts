import assert from "node:assert/strict";
// @ts-expect-error Node's type-stripping runner requires the explicit extension.
import { buildRecommendedItinerary } from "../lib/itinerary-recommendations.ts";

const courses = [
  {
    id: 1,
    course_name: "Nearby Links",
    independent_guest_days: "Everyday",
    price_range: "€€",
    course_type: "Links",
    distance: 12,
    season_start_month: 3,
    season_end_month: 11,
  },
  {
    id: 2,
    course_name: "Weekend Links",
    independent_guest_days: "Weekend",
    price_range: "€",
    course_type: "Links",
    distance: 20,
    season_start_month: 1,
    season_end_month: 12,
  },
  {
    id: 3,
    course_name: "Value Parkland",
    independent_guest_days: "Weekdays",
    price_range: "€",
    course_type: "Parkland",
    distance: 18,
    season_start_month: 1,
    season_end_month: 12,
  },
  {
    id: 4,
    course_name: "Too Far Away",
    independent_guest_days: "Everyday",
    price_range: "€",
    course_type: "Links",
    distance: 140,
    season_start_month: 1,
    season_end_month: 12,
  },
  {
    id: 5,
    course_name: "Out of Season Links",
    independent_guest_days: "Everyday",
    price_range: "€",
    course_type: "Links",
    distance: 2,
    season_start_month: 10,
    season_end_month: 2,
  },
];

const newTrip = buildRecommendedItinerary({
  courses,
  existingCourses: [],
  days: [
    { dayNumber: 1, dayType: "Weekday" },
    { dayNumber: 2, dayType: "Weekend" },
    { dayNumber: 3, dayType: "Weekday" },
  ],
  monthNumber: 6,
  maxDistanceKm: 75,
  budgetPreference: "value",
  courseTypePreference: "links",
});

assert.equal(newTrip.selectedCourses.length, 3);
assert.deepEqual(
  newTrip.selectedCourses
    .map((course) => course.assigned_day)
    .sort((left, right) => Number(left) - Number(right)),
  [1, 2, 3],
);
assert.equal(newTrip.unfilledDays.length, 0);
assert.ok(
  newTrip.selectedCourses.every(
    (course) => course.automatically_recommended === true,
  ),
);
assert.ok(!newTrip.selectedCourses.some((course) => course.id === 4));
assert.ok(!newTrip.selectedCourses.some((course) => course.id === 5));

const existingTrip = buildRecommendedItinerary({
  courses,
  existingCourses: [
    {
      id: 10,
      course_name: "Already Assigned",
      independent_guest_days: "Everyday",
      price_range: "€€",
      course_type: "Parkland",
      distance: 8,
      assigned_day: 1,
      assigned_slot: "Morning",
    },
    {
      id: 11,
      course_name: "Shortlisted Course",
      independent_guest_days: "Weekdays",
      price_range: "€€",
      course_type: "Parkland",
      distance: 15,
    },
  ],
  days: [
    { dayNumber: 1, dayType: "Weekday" },
    { dayNumber: 2, dayType: "Weekday" },
    { dayNumber: 3, dayType: "Weekend" },
  ],
  monthNumber: 6,
  maxDistanceKm: 75,
  budgetPreference: "balanced",
  courseTypePreference: "any",
});

assert.equal(existingTrip.selectedCourses[0].assigned_day, 1);
assert.equal(existingTrip.selectedCourses[1].assigned_day, 2);
assert.equal(existingTrip.selectedCourses.length, 3);
assert.equal(existingTrip.addedCourseIds.length, 1);
assert.deepEqual(existingTrip.unfilledDays, []);

console.log("Itinerary recommendation checks passed");
