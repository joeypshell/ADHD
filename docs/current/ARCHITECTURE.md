# Current Architecture

This document describes the app as it exists now. Keep it factual. Future ideas belong in `docs/planning/`.

## App Type

Life Command Center is a static GitHub Pages app. It has no build step and no backend.

Runtime files:

- `index.html`
- `styles.css`
- `sync-config.js`
- `app.js`
- `sw.js`
- `manifest.webmanifest`
- `icon.svg`

## Storage

All active user data is stored in browser `localStorage`.

Current key:

- `life-command-center-v2`

Legacy key:

- `life-command-center-v1`

Because GitHub Pages is static, the app cannot sync data back to GitHub by itself. Import/export is the current backup path.

`sync-config.js` defines `window.LCC_SYNC_CONFIG`. It is disabled by default and may contain only browser-safe public values, such as a Supabase project URL, public anon key, and Supabase JS CDN URL.

When sync is configured, the Settings sync panel can:

- load the Supabase browser client on demand
- send an email magic-link login
- restore a Supabase Auth session
- sign out without deleting local task data
- manually upload or download one user-scoped `user_state` JSON document

Magic-link sends persist `sync.lastLoginLinkSentAt` locally and enforce a one-hour resend cooldown in the UI. This keeps repeated taps from burning through Supabase's low default email quota.

Sync is manual. There is no background auto-sync, no per-item merge, and no app-level end-to-end encryption. Supabase row-level security is expected to protect each user's row.

## Data Model

The main state object contains:

- `version`
- `createdAt`
- `lastReviewed`
- `lastBackupAt`
- `mode`
- `filter`
- `todayPlan`
- `focusSession`
- `dailyCheckin`
- `alerts`
- `sync`
- `items`
- `recurring`

`recurring` is retained for legacy migration and normalized into rhythm items.

Each item is either:

- `project`: finite work with steps and optional due/review dates.
- `rhythm`: recurring life rail with cadence, minimum action, `lastDone`, and `nextDue`.

Important item fields:

- `mode`: `home`, `work`, or `both`
- `timeWindow`: `anytime`, `morning`, `midday`, `afternoon`, `evening`, `night`, or `exact`
- `exactTime`: optional `HH:mm`
- `status`: `inbox`, `red`, `now`, `active`, `waiting`, `later`, `paused`, or `done`
- `steps`
- `minimum`, `rhythmGood`, and `rhythmFull` for recurring rhythm ladders
- `importance`
- `dread`
- `snoozeCount`
- `completedAt`

## Today Generation

The Today dashboard is automatic. It does not depend on launching or planning a day.

Rhythms act as virtual generated tasks for the current day. A rhythm appears on Today when its cadence says it is due or overdue, then its time window changes priority and bucket placement. Completing a rhythm records `lastDone`, advances `nextDue`, and keeps a completed-today row visible on the dashboard for the rest of the day.

Rhythms can carry a three-level action ladder:

- minimum: the smallest version that can count on a hard day
- good: a useful middle version
- full: the complete reset when capacity is available

Items enter Today when they are:

- in focus or marked doing
- red zone
- explicitly planned today
- captured today in inbox
- due or overdue
- review due
- waiting checkback due
- rhythm due or overdue
- active in the current or upcoming time window, for one-off items and rhythms due today
- missed from an earlier time window, for one-off items and rhythms due today
- completed today

The top recommendation comes from deterministic scoring in `todayQueueScore()` over unfinished `todayCandidateEntries()`.

The Today recommendation intentionally excludes completed-today items. The Today queue uses `todayDashboardEntries()` so it can show the whole day grouped as Now / Next / Later / Missed / Done.

The optional daily check-in can adjust scoring for the current day:

- energy: low, medium, high
- brain state: ready, foggy, avoiding, overloaded

The check-in is local and resets when stale. The stored value for Ready remains `clear` for compatibility. The Today screen explains the selected check-in effect and adds matching reason chips to the recommendation when those rules affect the top item.

## Time Windows

Time windows are simple bands:

- morning: 5:00 to 11:00
- midday: 11:00 to 14:00
- afternoon: 14:00 to 17:00
- evening: 17:00 to 21:00
- night: 21:00 to 5:00

Missed time-window items stay visible instead of disappearing.

## Primary Surfaces

Today:

- mode switch
- compact optional energy/brain-state check-in
- sticky focus anchor when a Doing timer is active
- recommendation card
- compact visual timeline: Now / Next / Later / Missed / Done
- complete Today list with direct Doing, Done, and same-day Undo actions
- quick capture with browser voice fill-in and a tiny-start follow-up

Doing and timers are intentionally separate. `status: "now"` means the item is being worked on or should stay at the top; a `focusSession` exists only when the user explicitly starts the timer. Today and item detail use explicit snooze destinations: 15 minutes, 1 hour, tonight, or tomorrow.

Add:

- quick capture with generated tiny starts, browser voice fill-in, and an optional clarification follow-up
- rule-based brain-dump triage
- templates
- first-run life rail starter for Body, House, and Work anchors
- wizard for project, rhythm, or rescue

Lists:

- filterable item cards
- status actions
- edit dialog

Map:

- SVG life-area map filtered by mode

Review:

- review candidates based on due/review/stale/red criteria

Settings / Backup:

- local export/import
- rhythm alert permission controls
- disabled-by-default Supabase sync controls
- email magic-link login/logout when configured, with a local resend cooldown
- first-sync choice dialog
- manual Sync now upload/download

## Focus Session

Focus state is stored in `state.focusSession`. It tracks:

- `itemId`
- `startedAt`
- `endsAt`
- `durationMinutes`
- `running`
- `pausedRemainingMs`
- `alertEnabled`
- `notifiedAt`

The Today recommendation card can mark an item as Doing, start a timer, pause, resume, pick an explicit snooze destination, and complete focus sessions. Notifications are limited to focus-timer permission and do not yet cover a broader reminder system.

An active focus session also renders a sticky Today anchor with:

- current task
- tiny step
- remaining time
- progress
- Done step / Pause / 1 hour / +5 min

## Notifications

Notification permission is user-initiated. The app can:

- notify when an enabled focus timer ends
- optionally send rate-limited due-rhythm alerts for the current browser

Notifications are not native push, widgets, live activities, or watch support.

## Voice Capture

Quick capture can use the browser Web Speech API when available. The transcript is inserted into the capture input for review and is not saved automatically. Unsupported browsers keep the normal typing flow.

## Brain Dump Triage

The Add view includes a rule-based brain dump flow:

- split pasted text into candidate tasks
- infer Project / Rhythm / Rescue / Later
- suggest tiny starts
- require user confirmation before saving

No AI is involved in this flow yet.

## Rendering

Rendering is currently vanilla DOM code in `app.js`.

Key render functions:

- `renderRecommendation()`
- `renderFocusAnchor()`
- `renderCheckin()`
- `renderTodayTimeline()`
- `renderBrainDumpCandidates()`
- `renderRhythmsDue()`
- `renderProjects()`
- `renderMap()`
- `renderReview()`
- `renderWizard()`
- `renderFocusDialog()`

This is acceptable for now, but large features should avoid making `renderRecommendation()` or global state more tangled.

## Service Worker

`sw.js` caches the static assets. Bump `CACHE_NAME` whenever shipped assets change.

## Current Limitations

- No automatic cross-device sync.
- No per-item cloud merge.
- No app-level end-to-end encryption for Supabase data.
- No cloud speech service or AI voice parsing.
- No AI-backed task extraction or prioritization.
- No native or cross-device reminder system.
- No full calendar integration.
- No automated browser test suite committed to the repo.
