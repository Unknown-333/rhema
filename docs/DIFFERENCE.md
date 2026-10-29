# What RHEMA shares, and what makes it its own

RHEMA started as a copy of Talvio, and Talvio already contains all of SpeakoFlow.
Both grew out of Handy. So on day one RHEMA was not a new product: it was Talvio
with a new name. This page says that plainly, feature by feature, and marks the
work that will make RHEMA its own thing.

Written during the audit on October 29, 2026. Keep it current as later turns add
RHEMA-only features.

## The file overlap, measured

The number that matters most: how much of RHEMA's code is also in the projects it
came from. Counted on the `origin/main` baseline (`0a97587`) against the
read-only `_reference/` copies of each project.

What was counted: every `.rs`, `.ts` and `.tsx` file, ignoring `node_modules`,
`target`, `dist`, `build` and `.git`. Before comparing, each file's path was
lower-cased and the product names in it were folded to one token
(`talvio`, `speakoflow`, `handy`, `rhema`, `rema` all become `app`), so a file
that was only renamed in the rebrand still counts as a match.

| Project | `.rs`/`.ts`/`.tsx` files | RHEMA files that also exist there |
| --- | --- | --- |
| RHEMA | 706 | — |
| Talvio | 712 | **705 of 706** |
| SpeakoFlow | 553 | 548 of 706 |

**705 of RHEMA's 706 code files also exist in Talvio.** The one file that does
not, `src-tauri/src/user_env.rs`, is not a RHEMA feature either: it holds only the
reader for the `RHEMA_` environment-variable prefix, and it shows up as "extra"
only because the rebrand renamed the file (its Talvio twin had a different,
product-named filename, so the path fold did not line them up). RHEMA adds **no
feature of its own yet.**

The exact command that produced these numbers (PowerShell, run from the workspace
root):

```powershell
function Get-NormSet($root){
  $root = (Resolve-Path $root).Path
  $set = @{}
  Get-ChildItem -Path $root -Recurse -File -Include *.rs,*.ts,*.tsx |
    Where-Object { $_.FullName -notmatch '\\(node_modules|target|\.git|dist|build)\\' } |
    ForEach-Object {
      $rel = $_.FullName.Substring($root.Length).TrimStart('\')
      $n = $rel.ToLower() -replace '\\','/'
      $n = $n -replace 'talvio','app' -replace 'speakoflow','app' `
              -replace 'handy','app' -replace 'rhema','app' -replace 'rema','app'
      $set[$n] = $rel
    }
  return $set
}
$rhema  = Get-NormSet 'wt\docs-audit'
$talvio = Get-NormSet '_reference\Talvio'
$speako = Get-NormSet '_reference\SpeakoFlow'
($rhema.Keys | Where-Object { $talvio.ContainsKey($_) }).Count   # 705
($rhema.Keys | Where-Object { -not $talvio.ContainsKey($_) })    # src-tauri\src\user_env.rs
($rhema.Keys | Where-Object { $speako.ContainsKey($_) }).Count   # 548
```

## Feature by feature

Legend for the project columns: ✓ has it · ◐ has part of it · ✗ does not have it.
The **RHEMA** column says what is true today, and the **proof** column names a
file (or the fact that there is nothing to point at yet).

### What RHEMA inherited and has today

| Feature | SpeakoFlow | Talvio | RHEMA today | Proof in RHEMA |
| --- | --- | --- | --- | --- |
| Local dictation, cleanup, dictionary, history | ✓ | ✓ | Inherited, unchanged | `src-tauri/src/actions.rs`, `transcription.rs`, `managers/history.rs` |
| Meetings (record, transcribe, notes) | ✓ | ✓ | Inherited, unchanged | `src-tauri/src/rhema_meetings.db` schema, `src/components/settings/meetings/` |
| Assistant panel (quick ask, spoken answers) | ✓ | ✓ | Inherited, unchanged | `src-tauri/src/assistant.rs`, `src/assistant/` |
| Voice calls and text-to-speech | ✓ | ✓ | Inherited, unchanged | `src-tauri/src/voice_conversation.rs`, `tts.rs`, `native_tts.rs` |
| Local personal memory | ✓ | ✓ | Inherited, unchanged | `src-tauri/src/memory.rs` |
| Screen vision | ✓ | ✓ | Inherited, unchanged | `src-tauri/src/screenshot.rs` |
| Command mode (spoken commands, browser-driven email) | ✗ | ✓ | Inherited, unchanged | `src-tauri/src/command_mode/` |
| Phone app (phone as mic and keyboard) | ✗ | ✓ | Inherited, unchanged | `mobile/` |
| Account server (accounts, devices, feedback) | ✗ | ✓ | Inherited, unchanged | `server/` |
| Relay (phone ↔ computer messages) | ✗ | ✓ | Inherited, unchanged | `src-tauri/src/account/remote/`, `socket.rs` |

Every row above is inherited work. The RHEMA column is honest: today it adds
nothing to any of these.

### What will make RHEMA its own product

These rows are RHEMA-only features that neither SpeakoFlow nor Talvio has. None of
them exist in the code yet; each is planned for a turn in `EXECUTION_PLAN.md`. The
proof column will name the real file once the turn lands.

| Feature | SpeakoFlow | Talvio | RHEMA plan | Proof (when built) |
| --- | --- | --- | --- | --- |
| Undo-first actions with a plan card and recipient checks | ✗ | ✗ | Planned, T19–T22 | `crates/rhema-actions/`, `src/rhema/plan/PlanCard.tsx` |
| Public Action Bench with a 0-wrong-recipient CI gate | ✗ | ✗ | Planned, T28–T29 | `bench/actions/commands.jsonl`, `crates/rhema-bench` |
| Offline fast path (common commands with no model call) | ✗ | ✗ | Planned, T30 | `crates/rhema-actions` fast-path grammar |
| Voice approvals for coding agents | ✗ | ✗ | Planned, T66–T68 | `crates/rhema-bridge`, `crates/rhema-cli` |
| "Why this format" chip on the pill | ✗ | ✗ | Planned, T59 | tone chip in `src/overlay/` |

### What RHEMA removes to stop being Talvio

Talvio's signature additions over SpeakoFlow were the phone app, the account
server and the relay. RHEMA's job is voice-to-action on the desktop, so these come
out of the 1.0 build. The code stays in Talvio, where it belongs.

| Feature | In Talvio | RHEMA plan | Turn |
| --- | --- | --- | --- |
| Phone app | ✓ | Removed from 1.0 | T08a |
| Account server | ✓ | Removed from 1.0 | T08a (free-credit and key-sync parts trimmed in T07) |
| Relay | ✓ | Removed from 1.0 | T08a |

See `docs/DECISIONS.md` for the keep / hide / remove decision on every large
inherited feature and the reason behind each one.
