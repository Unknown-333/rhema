# Decisions

Why RHEMA is built the way it is. One entry per decision: what was decided, what
else was considered, the reason, and the plan turn that carries it out.

Started during the audit on October 29, 2026.

## The rules this audit used

RHEMA is a voice-to-action app that also dictates. For each large inherited
feature the choice is **keep**, **hide** or **remove** for 1.0:

- **Keep** only what voice-to-action or dictation needs to work.
- **Hide** behind Settings → Experimental anything inherited that RHEMA does not
  need but that costs nothing to leave in.
- **Remove** Talvio's signature additions that are not part of RHEMA's job: the
  phone app, the account server and the relay (turn T08a).

Nothing is deleted during the audit itself. Where a hide or remove decision has
no turn in `EXECUTION_PLAN.md` yet, the entry says **"no turn yet"** and it is
listed in the audit report. The audit does not edit `EXECUTION_PLAN.md` (another
work item owns it).

---

## D-A01 · Dictation — **keep**

- **Code:** `src-tauri/src/actions.rs`, `transcription.rs`, `transcription/`,
  `smart_spacing/`, `managers/history.rs`, `managers/language.rs`,
  dictionary and custom-words handling.
- **Options considered:** keep; strip down to a bare dictation path.
- **Reason:** dictation is RHEMA's own core, not a side feature — `EXECUTION_PLAN.md`
  §2.1 lists it as what a 1.0 user gets, and Taco judges the dictation core first.
  Voice-to-action also rides on the same recording and transcription pipeline.
- **Turn:** inherited, kept throughout. Parity and RHEMA-only polish in T58–T60
  (tone per app, the "why" chip, private mode).

## D-A02 · Command mode — **keep**

- **Code:** `src-tauri/src/command_mode/` (`router.rs`, `registry.rs`, `schema.rs`,
  `tools/`, `effects/`, `review.rs`, `contacts.rs`, `agent/`, `voice.rs`).
- **Options considered:** keep and build on; replace with a new engine.
- **Reason:** command mode is the foundation of the action engine. The whole
  action track (T14–T30) extends it — connectors, plan card, risk tiers and the
  fast path all plug into its router and `Effects` seam rather than replacing it.
- **Turn:** inherited, kept and extended. Seams added in T16 (`dynamic_tools.rs`),
  T19–T22 (plan card and executor).

## D-A03 · Assistant panel — **keep**

- **Code:** `src-tauri/src/assistant.rs`, `assistant/` (`turn.rs`, `act.rs`,
  `phone.rs`), `src/assistant/`.
- **Options considered:** keep; hide behind Experimental.
- **Reason:** voice-to-action needs it. The assistant's tool loop and its
  `do_on_computer` path are how spoken requests reach the action engine, and the
  Jarvis layer (T61–T68) is built on the panel and the quick ask. Hiding it would
  cut the surface the action work depends on.
- **Turn:** inherited, kept. Built on in T26 (reply-in-style) and T61–T68 (Jarvis).

## D-A04 · Voice calls and text-to-speech — **keep**

- **Code:** `src-tauri/src/voice_conversation.rs`, `tts.rs`, `native_tts.rs`,
  `src/assistant/useVoiceConversation.ts`.
- **Options considered:** keep; hide behind Experimental.
- **Reason:** voice-to-action needs spoken confirmation and spoken answers.
  Spoken yes/no on the plan card (T63) and the faster voice loop (T64) use the
  call VAD and the TTS pipeline directly.
- **Turn:** inherited, kept. Used by T63–T64.

## D-A05 · Personal memory — **keep**

- **Code:** `src-tauri/src/memory.rs`.
- **Options considered:** keep; hide behind Experimental; remove.
- **Reason:** local-first and on-brand, and dictation and voice-to-action both
  draw on it — "reply in my style" (T26) builds a local profile, and the
  assistant personalises answers from memory. It is advisory and off-path, so it
  costs little to keep.
- **Turn:** inherited, kept. Drawn on by T26.

## D-A06 · Screen vision — **keep**

- **Code:** `src-tauri/src/screenshot.rs`, the two screen-access settings
  (`assistant_ask_screen_access`, `assistant_call_screen_access`).
- **Options considered:** keep; hide behind Experimental.
- **Reason:** voice-to-action needs to read the screen. Cursor-as-context (T15)
  and "reply to this" (T26) depend on reading what is in front of the user.
  Screen access is already off by default and decided per message, so the privacy
  posture is already conservative.
- **Turn:** inherited, kept. Extended by T14–T15 (context engine) and T26.

## D-A07 · Meetings — **hide** · **no turn yet**

- **Code:** `src-tauri/src/` meeting manager and `rhema_meetings.db` schema,
  `src/components/settings/meetings/`, `src/meeting/` (meeting pill).
- **Options considered:** keep; hide behind Settings → Experimental; remove.
- **Reason:** neither dictation nor voice-to-action needs meetings. It is a
  separate inherited product surface (its own database, pill and pages). By the
  audit rule it should be hidden behind Settings → Experimental for 1.0 rather
  than shipped as a headline feature or deleted. Removal was rejected because the
  code is self-contained and may return later; keeping it visible was rejected
  because it dilutes what RHEMA is.
- **Turn:** **no turn yet.** `EXECUTION_PLAN.md` has no turn that hides meetings
  behind Experimental. Note that §2.1 of that plan currently folds meetings into
  the inherited dictation group it keeps, which is a tension the owner should
  resolve. Listed in the audit report.

## D-A08 · Phone app — **remove**

- **Code:** `mobile/` (Flutter), plus the desktop remote-input handling it drives.
- **Options considered:** keep; hide; remove.
- **Reason:** the phone app is Talvio's signature addition and is not part of
  RHEMA's desktop voice-to-action job. It also needs a hosted account server that
  1.0 does not have. The code stays in Talvio.
- **Turn:** **T08a** (removes `mobile/`). If a phone ever returns it should be
  RHEMA's own account-free design (see `EXECUTION_PLAN.md` Phase 13), not Talvio's.

## D-A09 · Account server — **remove**

- **Code:** `server/` (Bun + TypeScript), and on the desktop the account sign-in,
  device list and free-credit / key-sync paths under `src-tauri/src/account/` and
  `src-tauri/src/free_credit.rs`.
- **Options considered:** keep; hide; remove.
- **Reason:** 1.0 has no hosted backend — running one costs money per user, and
  RHEMA's router uses the built-in local model or the user's own key. The account
  server is Talvio's, and the features that leaned on it (free credit, key sync,
  the admin dashboard) go with it. The code stays in Talvio.
- **Turn:** **T07** trims free credit, key sync and the admin dashboard; **T08a**
  removes the rest of `server/` and the desktop account surface.

## D-A10 · Relay — **remove**

- **Code:** `src-tauri/src/account/remote/`, `account/socket.rs`,
  `account/discovery.rs` (the phone ↔ computer message relay and its discovery).
- **Options considered:** keep; hide; remove.
- **Reason:** the relay exists only to connect the phone app and the account
  server, both of which are being removed. With nothing on either end it has no
  job in 1.0. Whatever command mode and the plan card still need from this area
  (for example the non-focus approval window in `account/approval.rs`) is kept and
  cut at the seam. The code stays in Talvio.
- **Turn:** **T08a** (removes the relay, socket and discovery; keeps the approval
  window the plan card copies).

---

## Decisions with no turn yet

Collected here so the owner can see at a glance what still needs a turn written
for it in `EXECUTION_PLAN.md`:

- **D-A07 Meetings — hide:** no turn hides meetings behind Settings →
  Experimental. §2.1 of the plan currently keeps meetings as an inherited
  feature, which conflicts with the hide decision. Needs the owner to decide and a
  turn to be added.
