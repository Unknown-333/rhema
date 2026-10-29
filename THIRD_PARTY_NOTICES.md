# Third-party notices

RHEMA is MIT-licensed (see [LICENSE](LICENSE)). It includes, links or
downloads the components below, each under its own license. This list covers
the components that ship with or are fetched by the app; every Rust crate and
npm package also carries its license in its own package metadata
(`cargo about` or `cargo license`, and `bun pm ls`, list them all).

Check this file before every release: add a row when a dependency or model is
added, and keep the license text of anything vendored next to it.

## Source code RHEMA is derived from

| Project    | License | Notice                             |
| ---------- | ------- | ---------------------------------- |
| Talvio     | MIT     | Copyright (c) 2026 Ishan Gautam    |
| SpeakoFlow | MIT     | Copyright (c) 2026 Abhishek Barali |
| Handy      | MIT     | Copyright (c) 2025 CJ Pais         |

## Vendored and patched code

| Component                                                   | Where                                                      | License                                                                               |
| ----------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| handy-keys 0.2.4 (patched)                                  | `src-tauri/vendor/handy-keys`                              | MIT, Copyright (c) 2026 handy-computer; text in `src-tauri/vendor/handy-keys/LICENSE` |
| Patched `tauri-runtime`, `tauri-runtime-wry`, `tauri-utils` | git dependency, `src-tauri/Cargo.toml` `[patch.crates-io]` | MIT or Apache-2.0 (Tauri)                                                             |
| `vad-rs`, `rodio` forks                                     | git dependencies                                           | MIT; rodio MIT or Apache-2.0                                                          |

## Native libraries linked into the app

| Component                                              | License       | Note                                                                                                                                                                               |
| ------------------------------------------------------ | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| transcribe.cpp (`transcribe-cpp` 0.4.0, includes ggml) | MIT           | Speech engine                                                                                                                                                                      |
| ONNX Runtime (`ort`)                                   | MIT           | Voice activity detection and diarization                                                                                                                                           |
| LAME (`mp3lame-encoder`)                               | LGPL-3.0      | Statically linked; used only to compress uploads to cloud speech providers. Scheduled for removal (see the plan). While it is linked, the corresponding source must stay available |
| libopus (`opus`)                                       | BSD-3-Clause  |                                                                                                                                                                                    |
| SQLite (`rusqlite`, bundled)                           | Public domain |                                                                                                                                                                                    |

## Downloaded at run time

| Component                                                                                  | License                                           | Note                                                                                                                                           |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Cleanup Mini (published as "SpeakoFlow Mini", `huggingface.co/SpeakoFlow/speakoflow-mini`) | Apache-2.0                                        | A fine-tune of Qwen3.5-0.8B (Apache-2.0). Downloaded on request; its training prompt is sent unchanged because the prompt is part of the model |
| Speech models from the bundled catalog (Parakeet, Nemotron, Whisper, Moonshine and others) | Per model (CC-BY-4.0, MIT, Apache-2.0 and others) | Each entry links its model card; check before redistributing a model                                                                           |
| llama.cpp `llama-server` (pinned build b11429)                                             | MIT                                               | Downloaded from the ggml-org releases on first local-LLM use                                                                                   |
| Silero VAD v4                                                                              | MIT                                               | Voice activity detection model                                                                                                                 |
| WeSpeaker speaker-embedding model                                                          | Check the model card                              | Meeting diarization                                                                                                                            |
| sherpa-onnx runtime and voices                                                             | Apache-2.0                                        | Voices include eSpeak NG data (GPL-3.0), downloaded separately at run time, never bundled                                                      |

## Fonts, icons and artwork

| Component                                                     | License                   |
| ------------------------------------------------------------- | ------------------------- |
| Inter, Geist, Geist Mono, Plus Jakarta Sans, Instrument Serif | SIL Open Font License 1.1 |
| Phosphor icons (mobile)                                       | MIT                       |
| Lucide icons                                                  | ISC                       |
| Simple Icons provider marks                                   | CC0-1.0                   |
| Lobe Icons provider marks                                     | MIT                       |
| RHEMA logo, wordmark and tray glyphs (`brand/`)                | Part of RHEMA, MIT         |

Provider names and logos shown in the settings identify those services and
remain their owners' trademarks.
