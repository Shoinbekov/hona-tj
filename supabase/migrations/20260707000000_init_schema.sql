-- Хона.тж initial schema: profiles, listings, listing_photos, favorites
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query → Run).

create extension if not exists pgcrypto;

-- ─── profiles ────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  phone      text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever someone signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'phone')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── listings ────────────────────────────────────────────────────────────
create table if not exists public.listings (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.profiles(id) on delete cascade,
  title         text not null,
  description   text,
  price         numeric not null,
  currency      text not null default 'USD',
  listing_type  text not null check (listing_type in ('sale', 'rent')),
  property_type text not null check (property_type in ('apartment', 'house', 'commercial', 'land', 'garage')),
  city          text not null default 'Душанбе',
  district      text,
  address       text,
  rooms         integer,
  area          numeric,
  floor         integer,
  total_floors  integer,
  lat           numeric,
  lng           numeric,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

alter table public.listings enable row level security;

create policy "Active listings are publicly readable, owners see their own"
  on public.listings for select
  using (is_active = true or auth.uid() = user_id);

create policy "Users can insert their own listings"
  on public.listings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own listings"
  on public.listings for update
  using (auth.uid() = user_id);

create policy "Users can delete their own listings"
  on public.listings for delete
  using (auth.uid() = user_id);

create index if not exists listings_user_id_idx       on public.listings(user_id);
create index if not exists listings_city_idx          on public.listings(city);
create index if not exists listings_district_idx      on public.listings(district);
create index if not exists listings_listing_type_idx  on public.listings(listing_type);
create index if not exists listings_property_type_idx on public.listings(property_type);
create index if not exists listings_is_active_idx     on public.listings(is_active);

-- ─── listing_photos ──────────────────────────────────────────────────────
create table if not exists public.listing_photos (
  id         uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  url        text not null,
  "order"    integer not null default 0
);

alter table public.listing_photos enable row level security;

create policy "Photos are readable wherever their listing is readable"
  on public.listing_photos for select
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_photos.listing_id
        and (l.is_active = true or l.user_id = auth.uid())
    )
  );

create policy "Users can add photos to their own listings"
  on public.listing_photos for insert
  with check (
    exists (select 1 from public.listings l where l.id = listing_photos.listing_id and l.user_id = auth.uid())
  );

create policy "Users can delete photos from their own listings"
  on public.listing_photos for delete
  using (
    exists (select 1 from public.listings l where l.id = listing_photos.listing_id and l.user_id = auth.uid())
  );

create index if not exists listing_photos_listing_id_idx on public.listing_photos(listing_id);

-- ─── favorites ───────────────────────────────────────────────────────────
create table if not exists public.favorites (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, listing_id)
);

alter table public.favorites enable row level security;

create policy "Users can view their own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can add their own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

create index if not exists favorites_user_id_idx    on public.favorites(user_id);
create index if not exists favorites_listing_id_idx on public.favorites(listing_id);

-- ─── storage: listing-photos bucket policies ────────────────────────────
-- The 'listing-photos' bucket itself is created via the Storage API (public bucket),
-- but object-level RLS policies still need to be defined here.
create policy "Public read access to listing photos"
  on storage.objects for select
  using (bucket_id = 'listing-photos');

create policy "Authenticated users upload to their own folder"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'listing-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users delete their own listing photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'listing-photos' and (storage.foldername(name))[1] = auth.uid()::text);
