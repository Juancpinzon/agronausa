-- Create orders table
create table if not exists orders (
  id                uuid        primary key default gen_random_uuid(),
  order_number      text        not null unique,
  customer_id       uuid        references auth.users(id) on delete set null,
  customer_snapshot jsonb       not null,
  items             jsonb       not null default '[]'::jsonb,
  subtotal          int         not null,
  total             int         not null,
  status            text        not null default 'pendiente',
  shipping_address  jsonb       not null,
  notes             text,
  admin_notes       text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table orders enable row level security;

-- Anyone (including anonymous guests) can create an order
create policy "Anyone can create orders" on orders
  for insert with check (true);

-- Authenticated users can read their own orders
create policy "Customers see own orders" on orders
  for select using (customer_id = auth.uid());

-- Admins can read and update all orders (role set in user metadata)
create policy "Admins manage orders" on orders
  for all using (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
