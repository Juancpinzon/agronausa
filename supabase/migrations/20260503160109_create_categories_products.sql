-- Create categories table
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Create products table
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  category_id uuid not null references categories(id) on delete cascade,
  price_retail int not null,
  price_wholesale int,
  unit text not null,
  min_wholesale_qty int,
  stock int not null default 0,
  images text[] not null default array[]::text[],
  active boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable row level security for public read access
alter table categories enable row level security;
create policy "Public read categories" on categories
  for select using (true);

alter table products enable row level security;
create policy "Public read products" on products
  for select using (true);
