-- Create profiles table linked to auth.users
create table if not exists profiles (
  id                  uuid        primary key references auth.users(id) on delete cascade,
  full_name           text        not null default '',
  phone               text        not null default '',
  customer_type       text        not null default 'persona'
                        check (customer_type in ('persona', 'negocio')),
  business_name       text,
  nit                 text,
  has_special_pricing boolean     not null default false,
  created_at          timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Admins manage profiles" on profiles
  for all using (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Auto-create profile row on sign-up (copies metadata from the signup call)
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, customer_type, business_name, nit)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'customer_type', 'persona'),
    new.raw_user_meta_data->>'business_name',
    new.raw_user_meta_data->>'nit'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Per-customer negotiated prices (B2B)
create table if not exists special_pricing (
  id          uuid        primary key default gen_random_uuid(),
  customer_id uuid        not null references profiles(id) on delete cascade,
  product_id  uuid        not null references products(id) on delete cascade,
  price       int         not null,
  created_at  timestamptz not null default now(),
  unique (customer_id, product_id)
);

alter table special_pricing enable row level security;

-- Users can only see their own special pricing
create policy "Users view own special pricing" on special_pricing
  for select using (auth.uid() = customer_id);

create policy "Admins manage special pricing" on special_pricing
  for all using (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Allow authenticated users to link orders to their account
-- (the existing "Customers see own orders" policy already covers SELECT)
-- Add UPDATE policy so order can be linked at checkout time if needed
