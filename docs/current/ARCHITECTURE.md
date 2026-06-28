# Current Architecture

This document describes the app as it exists now. Keep it factual. Future ideas belong in `docs/planning/`.

## App Type

Life Command Center is a static GitHub Pages app. It has no build step and no backend.

Runtime files:

- `index.html`
- `styles.css`
- `app.js`
- `sw.js`
- `manifest.webmanifest`
- `icon.svg`

## Storage

All user data is stored in browser `localStorage`.

Current key:

- `life-command-center-v2`

Legacy key:

- `life-command-center-v1`

Because GitHub Pages is static, the app cannot sync data back to GitHub by itself. Import/export is the current backup path.

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
- `importance`
- `dread`
- `snoozeCount`

## Today Generation

The Today dashboard is automatic. It does not depend on launching or planning a day.

Items enter Today when they are:

- in focus or marked doing
- red zone
- explicitly planned today
- captured today in inbox
- due or overdue
- review due
- waiting checkback due
- rhythm due or overdue
- active in the current or upcoming time window
- missed from an earlier time window

The top recommendation comes from deterministic scoring in `todayQueueScore()`. The complete list comes from `todayCandidateEntries()`.

The optional daily check-in can adjust scoring for the current day:

- energy: low, medium, high
- brain state: clear, foggy, avoiding, overloaded

The check-in is local and resets when stale.

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
- energy/brain-state check-in
- sticky focus anchor when a Doing timer is active
- recommendation card
- visual timeline: Now / Next / Later / Missed
- complete Today list
- quick capture

Add:

- quick capture
- rule-based brain-dump triage
- templates
- wizard for project, rhythm, or rescue

Lists:

- filterable item cards
- status actions
- edit dialog

Map:

- SVG life-area map filtered by mode

Review:

- review candidates based on due/review/stale/red criteria

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

The Today recommendation card can start, pause, resume, snooze, and complete focus sessions. Notifications are limited to focus-timer permission and do not yet cover a broader reminder system.

An active focus session also renders a sticky Today anchor with:

- current task
- tiny step
- remaining time
- progress
- Done step / Pause / Snooze / +5 min

## Notifications

Notification permission is user-initiated. The app can:

- notify when an enabled focus timer ends
- optionally send rate-limited due-rhythm alerts for the current browser

Notifications are not native push, widgets, live activities, or watch support.

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

- No cross-device sync.
- No login.
- No cloud storage.
- No voice-to-text capture.
- No AI-backed task extraction or prioritization.
- No native or cross-device reminder system.
- No full calendar integration.
- No automated browser test suite committed to the repo.
