-- Planner V2 metadata only. Existing trip and course data remains unchanged.
-- Existing trips remain valid because all added fields are nullable.
begin;

alter table public.trips
  add column if not exists country text,
  add column if not exists courses_wanted integer,
  add column if not exists owner_token_hash text;

alter table public.trips
  drop constraint if exists trips_country_allowed,
  add constraint trips_country_allowed
    check (country is null or country in ('Ireland', 'Switzerland', 'Portugal')),
  drop constraint if exists trips_courses_wanted_positive,
  add constraint trips_courses_wanted_positive
    check (courses_wanted is null or courses_wanted between 1 and 14),
  drop constraint if exists trips_owner_token_hash_format,
  add constraint trips_owner_token_hash_format
    check (owner_token_hash is null or owner_token_hash ~ '^[0-9a-f]{64}$');

create index if not exists trips_country_idx on public.trips (country);

create or replace function public.planner_v2_create_trip(
  p_trip_id text, p_trip_code text, p_trip_name text, p_base_location text,
  p_base_latitude double precision, p_base_longitude double precision,
  p_country text, p_courses_wanted integer, p_owner_token_hash text,
  p_planner_user_id text
) returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare v_trip public.trips;
begin
  if p_country not in ('Ireland', 'Switzerland', 'Portugal') then raise exception 'Invalid country'; end if;
  insert into public.trips (
    trip_id, trip_code, trip_name, base_location, base_latitude, base_longitude,
    month_of_travel, golf_ireland_member, number_of_golfers, number_of_golf_days,
    selected_courses, itinerary, country, courses_wanted, owner_token_hash, planner_user_id
  ) values (
    p_trip_id, p_trip_code, left(p_trip_name, 100), left(p_base_location, 120),
    p_base_latitude, p_base_longitude, 'Flexible', 'Not specified', 1, 1,
    '[]'::jsonb, '[]'::jsonb, p_country, p_courses_wanted, p_owner_token_hash, p_planner_user_id
  ) returning * into v_trip;
  return jsonb_build_object('trip_id', v_trip.trip_id, 'trip_code', v_trip.trip_code, 'country', v_trip.country);
end;
$$;

create or replace function public.planner_v2_get_trip(p_trip_id text) returns jsonb
language sql stable security definer set search_path = public, pg_temp as $$
  select to_jsonb(t) - 'owner_token_hash' - 'planner_user_id'
    from public.trips t where t.trip_id = p_trip_id limit 1;
$$;

create or replace function public.planner_v2_trip_id_from_code(p_trip_code text) returns text
language sql stable security definer set search_path = public, pg_temp as $$
  select t.trip_id from public.trips t
    where upper(t.trip_code) = upper(regexp_replace(p_trip_code, '^GPG-?', '', 'i'))
    limit 1;
$$;

create or replace function public.planner_v2_list_trips(p_planner_user_id text) returns jsonb
language sql stable security definer set search_path = public, pg_temp as $$
  select coalesce(jsonb_agg(q.trip order by q.created_at desc), '[]'::jsonb)
  from (
    select jsonb_build_object(
      'trip_id', t.trip_id, 'trip_name', t.trip_name, 'base_location', t.base_location,
      'country', t.country, 'courses_wanted', t.courses_wanted,
      'selected_courses', coalesce(t.selected_courses, '[]'::jsonb), 'created_at', t.created_at
    ) as trip, t.created_at
    from public.trips t where t.planner_user_id = p_planner_user_id
    order by t.created_at desc limit 20
  ) q;
$$;

create or replace function public.planner_v2_add_course(p_trip_id text, p_course_id bigint) returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare v_trip public.trips; v_course public.courses; v_json jsonb; v_distance double precision;
begin
  select * into v_trip from public.trips where trip_id = p_trip_id for update;
  if not found then raise exception 'Trip not found'; end if;
  select * into v_course from public.courses where id = p_course_id;
  if not found then raise exception 'Course not found'; end if;
  if exists (select 1 from jsonb_array_elements(coalesce(v_trip.selected_courses, '[]'::jsonb)) x where (x->>'id')::bigint = p_course_id) then
    return coalesce(v_trip.selected_courses, '[]'::jsonb);
  end if;
  if v_trip.base_latitude is not null and v_trip.base_longitude is not null and v_course.latitude is not null and v_course.longitude is not null then
    v_distance := 6371 * 2 * asin(sqrt(
      sin(radians(v_course.latitude - v_trip.base_latitude) / 2)^2 +
      cos(radians(v_trip.base_latitude)) * cos(radians(v_course.latitude)) *
      sin(radians(v_course.longitude - v_trip.base_longitude) / 2)^2
    ));
  end if;
  v_json := jsonb_build_object(
    'id', v_course.id, 'course_name', v_course.course_name, 'town', v_course.town,
    'region', v_course.region, 'holes', v_course.holes,
    'independent_guest_days', v_course.independent_guest_days, 'season', v_course.season,
    'price_range', v_course.price_range, 'course_type', v_course.course_type,
    'course_image', v_course.course_image, 'latitude', v_course.latitude,
    'longitude', v_course.longitude, 'max_handicap', v_course.max_handicap,
    'distance', v_distance
  );
  update public.trips set selected_courses = coalesce(selected_courses, '[]'::jsonb) || jsonb_build_array(v_json) where trip_id = p_trip_id;
  return (select selected_courses from public.trips where trip_id = p_trip_id);
end;
$$;

drop function if exists public.planner_v2_remove_course(text, bigint, text);
create function public.planner_v2_remove_course(p_trip_id text, p_course_id bigint, p_owner_token_hash text, p_legacy_owner_id text) returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare v_trip public.trips; v_courses jsonb;
begin
  select * into v_trip from public.trips where trip_id = p_trip_id for update;
  if not found then raise exception 'Trip not found'; end if;
  if not (
    (v_trip.owner_token_hash is not null and v_trip.owner_token_hash = p_owner_token_hash)
    or (v_trip.owner_token_hash is null and v_trip.planner_user_id is not null and v_trip.planner_user_id = p_legacy_owner_id)
  ) then raise exception 'Only the organiser can remove courses'; end if;
  select coalesce(jsonb_agg(x.value), '[]'::jsonb) into v_courses
    from jsonb_array_elements(coalesce(v_trip.selected_courses, '[]'::jsonb)) x(value)
    where (x.value->>'id')::bigint <> p_course_id;
  update public.trips set selected_courses = v_courses where trip_id = p_trip_id;
  delete from public.trip_votes where trip_id = p_trip_id and course_id = p_course_id;
  return v_courses;
end;
$$;

create or replace function public.planner_v2_update_trip(
  p_trip_id text, p_trip_name text, p_number_of_golfers integer, p_owner_token_hash text
) returns boolean
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  update public.trips set
    trip_name = coalesce(left(nullif(btrim(p_trip_name), ''), 100), trip_name),
    number_of_golfers = coalesce(p_number_of_golfers, number_of_golfers)
  where trip_id = p_trip_id and owner_token_hash = p_owner_token_hash
    and (p_number_of_golfers is null or p_number_of_golfers between 1 and 32);
  return found;
end;
$$;

create or replace function public.planner_v2_get_votes(p_trip_id text)
returns table(course_id bigint, vote text, participant_id text)
language sql stable security definer set search_path = public, pg_temp as $$
  select v.course_id, v.vote, v.participant_id from public.trip_votes v where v.trip_id = p_trip_id;
$$;

create or replace function public.planner_v2_set_vote(
  p_trip_id text, p_course_id bigint, p_participant_id text, p_vote text
) returns boolean
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if p_vote is not null and p_vote not in ('up', 'down', 'must_play', 'happy_to_play', 'not_for_me') then raise exception 'Invalid vote'; end if;
  if not exists (select 1 from public.trips t, jsonb_array_elements(coalesce(t.selected_courses, '[]'::jsonb)) x where t.trip_id = p_trip_id and (x->>'id')::bigint = p_course_id) then raise exception 'Course is not on this trip'; end if;
  if p_vote is null then
    delete from public.trip_votes where trip_id = p_trip_id and course_id = p_course_id and participant_id = p_participant_id;
  else
    insert into public.trip_votes (trip_id, course_id, participant_id, vote)
      values (p_trip_id, p_course_id, p_participant_id, p_vote)
      on conflict (trip_id, course_id, participant_id) do update set vote = excluded.vote;
  end if;
  return true;
end;
$$;

revoke all on function public.planner_v2_create_trip(text,text,text,text,double precision,double precision,text,integer,text,text) from public;
revoke all on function public.planner_v2_get_trip(text) from public;
revoke all on function public.planner_v2_trip_id_from_code(text) from public;
revoke all on function public.planner_v2_list_trips(text) from public;
revoke all on function public.planner_v2_add_course(text,bigint) from public;
revoke all on function public.planner_v2_remove_course(text,bigint,text,text) from public;
revoke all on function public.planner_v2_update_trip(text,text,integer,text) from public;
revoke all on function public.planner_v2_get_votes(text) from public;
revoke all on function public.planner_v2_set_vote(text,bigint,text,text) from public;
grant execute on function public.planner_v2_create_trip(text,text,text,text,double precision,double precision,text,integer,text,text) to anon, authenticated;
grant execute on function public.planner_v2_get_trip(text) to anon, authenticated;
grant execute on function public.planner_v2_trip_id_from_code(text) to anon, authenticated;
grant execute on function public.planner_v2_list_trips(text) to anon, authenticated;
grant execute on function public.planner_v2_add_course(text,bigint) to anon, authenticated;
grant execute on function public.planner_v2_remove_course(text,bigint,text,text) to anon, authenticated;
grant execute on function public.planner_v2_update_trip(text,text,integer,text) to anon, authenticated;
grant execute on function public.planner_v2_get_votes(text) to anon, authenticated;
grant execute on function public.planner_v2_set_vote(text,bigint,text,text) to anon, authenticated;

commit;
