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
  supabaseJsUrl: "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm",
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

## Auth Providers

Keep email magic link enabled as the fallback login path.

Google and Apple login are optional Supabase Auth providers. Their provider client IDs and client secrets belong in the Supabase dashboard and the provider consoles, not in `sync-config.js` or any GitHub Pages file.

### Google

1. Create or use a Google Cloud project.
2. Configure the OAuth consent screen.
3. Create a Web OAuth client.
4. Add the callback URL shown in Supabase Auth provider settings to the Google OAuth client.
5. Paste the Google client ID and client secret into Supabase Auth -> Providers -> Google.
6. Enable the Google provider in Supabase.

The app starts this flow with Supabase provider id `google`.

### Apple

1. Configure Sign in with Apple in the Apple Developer account.
2. Create the required Service ID / web auth configuration.
3. Add the callback URL shown in Supabase Auth provider settings to the Apple web auth configuration.
4. Paste the Apple client id / service id and secret material required by Supabase into Supabase Auth -> Providers -> Apple.
5. Enable the Apple provider in Supabase.

The app starts this flow with Supabase provider id `apple`.

### B2B / Keycloak

Do not add Keycloak for the first personal sync version. Keycloak or enterprise SSO can be revisited if the app becomes an organization-facing product with SAML/OIDC requirements.

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
- the app does not add end-to-end encryption before storing `state_json` in Supabase

This intentionally avoids per-item merge complexity until the one-document sync loop is trustworthy.
