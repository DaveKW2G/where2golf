-- Run after Planner V2 is deployed and verified. The app's trip APIs now use
-- the narrowly scoped planner_v2_* functions instead of direct table access.
begin;

drop policy if exists "Allow anonymous trip read" on public.trips;
drop policy if exists "Allow anonymous trip creation" on public.trips;
drop policy if exists "Allow anonymous trip updates" on public.trips;
drop policy if exists "Allow anonymous selected_courses updates" on public.trips;
drop policy if exists "Allow anonymous trip selected course updates" on public.trips;
drop policy if exists "Allow read trip votes" on public.trip_votes;
drop policy if exists "Allow insert trip votes" on public.trip_votes;
drop policy if exists "Allow update trip votes" on public.trip_votes;

commit;
