-- El rol admin pasa de user_metadata (editable por el propio usuario con
-- supabase.auth.updateUser) a app_metadata (solo lo escribe el servidor).

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
$$;

-- 1. Migrar a los admins actuales y quitar el rol de user_metadata
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where raw_user_meta_data ->> 'role' = 'admin';

update auth.users
set raw_user_meta_data = raw_user_meta_data - 'role'
where raw_user_meta_data ? 'role';

-- 2. Políticas de tablas
drop policy if exists "Admins pueden actualizar productos" on public.products;
drop policy if exists "Admins pueden crear productos" on public.products;
drop policy if exists "Admins pueden borrar productos" on public.products;
create policy "Admins pueden actualizar productos" on public.products for update using (public.is_admin()) with check (public.is_admin());
create policy "Admins pueden crear productos" on public.products for insert with check (public.is_admin());
create policy "Admins pueden borrar productos" on public.products for delete using (public.is_admin());

drop policy if exists "Admins manage orders" on public.orders;
create policy "Admins manage orders" on public.orders for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage special pricing" on public.special_pricing;
create policy "Admins manage special pricing" on public.special_pricing for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin_all" on public.inventory_movements;
create policy "admin_all" on public.inventory_movements for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin_all" on public.suppliers;
create policy "admin_all" on public.suppliers for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin_write" on public.app_settings;
create policy "admin_write" on public.app_settings for all using (public.is_admin()) with check (public.is_admin());

-- 3. Consentimientos (Ley 1581): antes los leía cualquier usuario autenticado
drop policy if exists "admin_select_consents" on public.consent_records;
create policy "admin_select_consents" on public.consent_records for select using (public.is_admin());

-- 4. Storage: antes cualquier usuario autenticado podía subir, cambiar o borrar fotos
drop policy if exists "Subida de imagenes" on storage.objects;
drop policy if exists "Actualizacion de imagenes" on storage.objects;
drop policy if exists "Borrado de imagenes" on storage.objects;
create policy "Subida de imagenes" on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());
create policy "Actualizacion de imagenes" on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
create policy "Borrado de imagenes" on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
