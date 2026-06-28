# Supabase Setup

This app is local-only by default. Supabase sync is disabled until a project URL and public anon key are added to `sync-config.js`.

Never commit the Supabase service role key, database password, OpenAI keys, or any other private secret to this static GitHub Pages app.

## Public Config

`sync-config.js` may contain only public browser-safe values:

```js
window.LCC_SYNC_CONFIG = {
  enabled: true,
  supabaseUrl: "https://YOUR_PROJECT.supabase.co",
  supabaseAnonKey: "YOUR_PUBLIC_ANON_KEY",
  provider: "supabase"
};
```

The anon key is public by design. Row-level security is what protects user data.

## Auth Redirect URLs

In Supabase Auth settings, add redirect URLs for:

- `https://joeypshell.github.io/ADHD/`
- `http://127.0.0.1:8080/`
- `http://localhost:8080/`

Add any additional local test ports used during browser QA.

## SQL Setup

Run this in the Supabase SQL editor.

```sql
create table if not exists public.user_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state_json jsonb not null,
  state_version integer not null,
  client_updated_at timestamptz not null,
  server_updated_at timestamptz not null default now(),
  last_sync_client_id text
);

alter table public.user_state enable row level security;

create or replace function public.set_user_state_server_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.server_updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_user_state_server_updated_at on public.user_state;

create trigger set_user_state_server_updated_at
before update on public.user_state
for each row
execute function public.set_user_state_server_updated_at();

drop policy if exists "Users can read their own state" on public.user_state;
create policy "Users can read their own state"
on public.user_state
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own state" on public.user_state;
create policy "Users can insert their own state"
on public.user_state
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own state" on public.user_state;
create policy "Users can update their own state"
on public.user_state
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own state" on public.user_state;
create policy "Users can delete their own state"
on public.user_state
for delete
using (auth.uid() = user_id);
```

## Verification Queries

Check that RLS is enabled:

```sql
select relname, relrowsecurity
from pg_class
where relname = 'user_state';
```

Check policies:

```sql
select policyname, cmd
from pg_policies
where schemaname = 'public'
  and tablename = 'user_state'
order by policyname;
```

## First Sync Model

The first version stores one JSON document per user:

- localStorage remains the offline cache
- `state_json` stores the normalized app state
- manual Sync Now runs before any auto-sync
- conflict handling starts with Keep this browser vs Use cloud copy

This intentionally avoids per-item merge complexity until the one-document sync loop is trustworthy.
