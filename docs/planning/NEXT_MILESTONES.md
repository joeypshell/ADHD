# Next Milestones

This file captures active product direction. Move completed details into `docs/current/` and stale ideas into `docs/archive/`.

## Product Direction

The app should become:

> Tiimo-like visual structure plus ADHD command-center decision logic.

It should not become a generic planner/calendar. Automatic decision support is the differentiator.

## Completed Recently

- Automatic Today dashboard.
- Full Today task list.
- Inline Doing flow.
- Row-level completion from Today.
- Visual Today timeline using Now / Next / Later / Missed.
- Home/Work mode filtering and themes.

## Priority 1: Make Focus Central

Goal:

Make the active focus session hard to lose.

Small version:

- sticky focus strip on Today when a session exists
- current step always visible
- large remaining time
- `Done step`, `Pause`, `Snooze`, `+5 min`

Out of scope:

- native live activities
- watch widgets
- full notification scheduler

Acceptance checks:

- active timer is visible after scrolling
- pause/resume updates visible state
- completing the step clears or advances the session correctly
- no horizontal overflow on mobile

## Priority 2: Energy Check-In

Goal:

Let the user quickly tell the app what kind of day it is, then adjust recommendation scoring.

Small version:

- Energy: Low / Medium / High
- Brain state: Clear / Foggy / Avoiding / Overloaded
- Stored locally for today only
- Low energy boosts tiny rhythms and low-estimate tasks
- Avoiding/overloaded boosts rescue-sized tiny starts
- High energy can boost red-zone or deep-work tasks

Out of scope:

- mood diary
- analytics
- long-term mental health tracking

Acceptance checks:

- changing energy changes Today ordering
- check-in is optional and quick
- state resets or becomes stale the next day

## Priority 3: Smarter Brain Dump

Goal:

Reduce typing and organizing friction when the user has messy thoughts.

Small version:

- paste a messy brain dump
- split likely tasks by line or sentence
- user taps Project / Rhythm / Rescue / Later
- app suggests tiny starts with rules

Out of scope:

- AI extraction
- cloud sync
- permanent inbox processing workflow

Acceptance checks:

- no task is created without user confirmation
- extracted tasks can be edited before save
- mobile layout remains simple

## Priority 4: Backup Confidence

Goal:

Make local-only storage less scary before adding sync.

Small version:

- show last backup date
- warn when no recent export exists
- make import/export copy clearer
- keep backup controls out of the primary Today path

Out of scope:

- cloud sync
- account login
- encrypted storage

Acceptance checks:

- backup status is visible in settings
- export updates last-backup state
- import confidence copy is clear

## Later: Sync, Login, Voice, AI

These are important, but they need planning before implementation.

Sync/login needs decisions about:

- provider
- authentication
- encryption and privacy
- merge conflicts
- offline behavior
- migration from localStorage

Voice-to-text needs decisions about:

- browser speech API vs provider API
- mobile browser support
- privacy and data transmission
- fallback for unsupported browsers

AI needs decisions about:

- local rules vs remote model
- what data leaves the browser
- user confirmation before creating tasks
- cost and rate limits
- failure modes

