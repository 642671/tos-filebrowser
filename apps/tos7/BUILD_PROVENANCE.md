# Build provenance and bundled executable

This package contains one prebuilt Linux executable from the upstream
FileBrowser Quantum project. It is not compiled by this wrapper at package
build time and is not modified after download. The wrapper adds TOS 7
packaging, configuration, a systemd unit, an nginx portal route, a
Unix-socket proxy, lifecycle scripts, and the launcher WebUI.

| Item | Value |
| --- | --- |
| Upstream project | https://github.com/gtsteffaniak/filebrowser |
| Upstream release tag | `v2.0.2-stable` |
| Upstream commit | `2c071d1e6eb48d4b88da2657885d345663a0a88b` |
| Upstream source archive | https://github.com/gtsteffaniak/filebrowser/archive/refs/tags/v2.0.2-stable.tar.gz |
| Upstream release workflow | https://github.com/gtsteffaniak/filebrowser/blob/v2.0.2-stable/.github/workflows/tag.yaml |
| Upstream license | Apache License 2.0 |
| TOS wrapper package version | `2.0.5` |
| Bundled executable path | `/usr/local/filebrowser-quantum/bin/filebrowser` |
| SBOM | `/usr/local/filebrowser-quantum/SBOM.spdx.json` (SPDX 2.3) |
| Third-party notice | `/usr/local/filebrowser-quantum/docs/THIRD_PARTY.md` |

## Purpose of the bundled executable

FileBrowser Quantum is the actual file manager. The TOS package cannot replace
it with a script or a TOS-native component without changing the application's
behaviour and its upstream security properties. The wrapper therefore packages
the unmodified official release asset for the target architecture.

## Downloaded assets

| Platform | Upstream asset | SHA-256 |
| --- | --- | --- |
| x86_64 | `https://github.com/gtsteffaniak/filebrowser/releases/download/v2.0.2-stable/linux-amd64-filebrowser` | `5710dc6f51d77f1db884eace44f6952286c49f2ce40b6a59af37e0dc7c4a8bbd` |
| aarch64 | `https://github.com/gtsteffaniak/filebrowser/releases/download/v2.0.2-stable/linux-arm64-filebrowser` | `03eac074efc1b0ef3cb39882c04eeee26027049d261b6b6706650d4ac2d8e21c` |

The upstream release workflow builds the Vue frontend, embeds it into the Go
backend, and runs GoReleaser for each target. The published executables are
UPX-compressed by that upstream workflow. The resulting files are statically
linked and have no section headers. `build.py` downloads these exact release
assets, verifies the SHA-256 values above, and places them unchanged at
`bin/filebrowser`.

## What this repository contributes

This repository contributes only the TOS 7 wrapper and its documentation:
configuration, systemd unit, nginx route, Unix-socket proxy, lifecycle
scripts, the TOS launcher page in `webui.bz2`, tests, build tooling, the SBOM
and this provenance record. It does not claim copyright in FileBrowser
Quantum.

## Reproduce a package

```bash
cd apps/tos7
python3 build.py --platform x86_64 --twice
python3 build.py --platform aarch64 --twice
```

The build fails if either upstream download does not match the recorded
SHA-256, if the SBOM is missing, or if the packaged route, unit, WebUI or
lifecycle scripts fail the built-in contract checks. It writes a `.sha256`
sidecar next to every generated `.deb`.
