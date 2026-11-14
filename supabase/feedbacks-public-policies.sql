-- BHAAI PDFs final feedback portal: public review access
-- Run this in Supabase SQL Editor for project vtonrpwqinzexcoupvzo.
-- This adds only missing policies; it does not delete or modify feedback rows.

alter table public.feedbacks enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='feedbacks'
      and policyname='Public can read feedbacks'
  ) then
    create policy "Public can read feedbacks"
      on public.feedbacks for select to anon, authenticated
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='feedbacks'
      and policyname='Public can submit feedbacks'
  ) then
    create policy "Public can submit feedbacks"
      on public.feedbacks for insert to anon, authenticated
      with check (
        char_length(coalesce(name, '')) <= 120
        and char_length(coalesce(text, '')) <= 2000
        and rating between 1 and 5
      );
  end if;
end
$$;

grant select, insert on table public.feedbacks to anon, authenticated;
