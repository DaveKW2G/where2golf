import assert from "node:assert/strict";
// @ts-expect-error Node's type-stripping runner requires the explicit extension.
import { createTripPackEmail, getDayRouteUrl } from "../lib/trip-email.ts";

const pack = {
  tripId: "GPG-TEST01",
  tripCode: "TEST01",
  tripName: "Dave's <Great> Trip",
  baseLocation: "Lahinch",
  baseLatitude: 52.936,
  baseLongitude: -9.345,
  monthOfTravel: "May",
  numberOfGolfers: 4,
  numberOfGolfDays: 2,
  participantCount: 3,
  siteUrl: "https://guestplaygolf.com/",
  courses: [
    {
      id: 1,
      course_name: "Lahinch Golf Club",
      town: "Lahinch",
      region: "Clare",
      price_range: "€€€€",
      assigned_day: 1,
      assigned_slot: "Morning" as const,
      website: "lahinchgolf.com",
      phone_number: "+353 65 708 1003",
      latitude: 52.935,
      longitude: -9.349,
      votes: { must_play: 2, happy_to_play: 1, not_for_me: 0 },
    },
    {
      id: 2,
      course_name: "Unsafe <script>",
      price_range: "€",
      assigned_day: null,
      assigned_slot: null,
      website: "javascript:alert(1)",
    },
  ],
};

const message = createTripPackEmail(pack);
const routeUrl = getDayRouteUrl(pack, [pack.courses[0]]);

assert.match(message.subject, /Dave's <Great> Trip/);
assert.ok(message.html.includes("Dave&#039;s &lt;Great&gt; Trip"));
assert.ok(!message.html.includes("<script>"));
assert.ok(!message.html.includes("javascript:alert"));
assert.ok(message.html.includes("€200–€350 per golfer"));
assert.ok(message.html.includes("€800–€1,400 for 4 golfers"));
assert.ok(message.html.includes("Open day route"));
assert.ok(message.html.includes("Trip code: TEST01"));
assert.ok(message.text.includes("Lahinch Golf Club"));
assert.ok(message.text.includes("Open and edit this trip"));
assert.ok(routeUrl?.includes("origin=52.936%2C-9.345"));
assert.ok(routeUrl?.includes("destination=52.935%2C-9.349"));

console.log("Trip email tests passed");
