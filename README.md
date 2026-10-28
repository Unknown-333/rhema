<p align="center">
  <img src="brand/png/lockup-dark-h256.png" alt="REMA" height="72" />
</p>

<p align="center"><strong>Say it once, and it lands right.</strong></p>

REMA is a local-first voice computing hub for Windows, macOS and Linux. Hold a
key, speak, let go: finished text appears where your cursor is, in any app.
Speech recognition and cleanup run on your own machine. A phone app turns your
phone into a wireless mic and remote for the computer.

> **Status: 0.1.0, pre-release.** REMA is being rebuilt into its own product.
> The roadmap is in the project plan; expect the UI and settings to change.

## What it does

- **Dictate anywhere.** Hold to talk, tap to toggle, or lock hands-free. Text
  is pasted with the clipboard restored afterwards, or typed directly.
- **Runs on your computer.** Speech-to-text runs locally on transcribe.cpp
  (Parakeet, Nemotron, Whisper, Moonshine and more) on your GPU or CPU, in a
  separate worker process, so a driver crash never takes the app down.
  Cloud speech and language providers are opt-in.
- **Clean output.** Optional AI cleanup removes filler words and applies spoken
  corrections, using a small local cleanup model or any model you choose. A
  dictionary keeps names and jargon spelled right and can learn from your
  corrections.
- **Live preview.** A small always-on-top pill shows what it hears while you
  speak.
- **Voice commands.** "Switch to Slack", "pause the music", "open the project
  report": REMA does it in your own apps, and asks before anything irreversible.
- **Meetings.** Records your microphone and the computer's sound as two lanes,
  transcribes them and writes notes when the call ends.
- **Phone remote.** Dictate into the computer from your phone, pick the window
  it types into, and press keys from across the room.
- **History and insights.** Search past dictations, re-transcribe saved audio,
  and see words, speed and time saved.

## Install

There is no public release yet. Build from source (below).

## Build from source

Requirements (Windows): Rust (stable), Bun, Visual Studio 2022 Build Tools
(Desktop development with C++), CMake, the Vulkan SDK and LLVM (set
`LIBCLANG_PATH`). Use a short `CARGO_TARGET_DIR` such as `C:\t`, because the
native build exceeds Windows' 260-character path limit. macOS and Linux steps
are in [BUILD.md](BUILD.md).

```sh
bun install
mkdir -p src-tauri/resources/models
curl -o src-tauri/resources/models/silero_vad_v4.onnx https://blob.handy.computer/silero_vad_v4.onnx
bun run tauri dev
```

Tests: `bun test src` (frontend), `cargo test` in `src-tauri` (backend),
`bun test` in `server` (account server).

## Repository layout

| Path         | What it is                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| `src-tauri/` | Rust backend: audio, speech engine supervisor, cleanup, paste, shortcuts, meetings, command mode      |
| `src/`       | React and TypeScript UI for every window (main, pill, assistant, meetings)                            |
| `mobile/`    | Flutter phone app (Android and iOS)                                                                   |
| `server/`    | Optional self-hosted account and relay server (Bun, SQLite) with its protocol in `server/PROTOCOL.md` |
| `brand/`     | Logo, icons and wordmark, generated from one set of dot bitmaps                                       |

## Privacy

Your voice is processed on your computer unless you turn on a cloud provider
for a feature. API keys live in the operating system's keychain. Details are in
[PRIVACY.md](PRIVACY.md).

## License

MIT. See [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
