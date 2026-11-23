# Build provenance

This package contains prebuilt Linux executables from the upstream
FileBrowser Quantum project. They are not compiled by this wrapper at package
build time and are not modified after download.

| Item | Value |
| --- | --- |
| Upstream project | https://github.com/gtsteffaniak/filebrowser |
| Upstream release tag | `v2.0.2-stable` |
| Upstream commit | `2c071d1e6eb48d4b88da2657885d345663a0a88b` |
| Upstream source archive | https://github.com/gtsteffaniak/filebrowser/archive/refs/tags/v2.0.2-stable.tar.gz |
| Upstream release workflow | https://github.com/gtsteffaniak/filebrowser/blob/v2.0.2-stable/.github/workflows/tag.yaml |
| Upstream license | Apache License 2.0 |
| TOS wrapper package version | `2.0.4` |

## Downloaded assets

| Platform | Upstream asset | SHA-256 |
| --- | --- | --- |
| x86_64 | `linux-amd64-filebrowser` | `5710dc6f51d77f1db884eace44f6952286c49f2ce40b6a59af37e0dc7c4a8bbd` |
| aarch64 | `linux-arm64-filebrowser` | `03eac074efc1b0ef3cb39882c04eeee26027049d261b6b6706650d4ac2d8e21c` |

The upstream release workflow builds the Vue frontend, embeds it into the Go
backend, then runs GoReleaser for each target. The published executables are
UPX-compressed by that upstream workflow. `build.py` downloads these exact
release assets, verifies the SHA-256 values above, and places them unchanged
at `/usr/local/filebrowser-quantum/bin/filebrowser`.

This repository contributes only the TOS 7 packaging wrapper: configuration,
systemd unit, Unix-socket proxy, lifecycle scripts, the TOS `webui.bz2`
launcher page, tests and build tooling.

## Reproduce a package

```bash
cd apps/tos7
python3 build.py --platform x86_64 --twice
python3 build.py --platform aarch64 --twice
```

The build fails if either upstream download does not match the recorded
SHA-256, and writes a `.sha256` sidecar next to every generated `.deb`.
