# Third-party software and bundled executable

This Debian package contains one prebuilt executable that is not built by this
repository:

| Path in package | File | Architecture | Origin |
| --- | --- | --- | --- |
| `bin/filebrowser` | `linux-amd64-filebrowser` | x86_64 | FileBrowser Quantum `v2.0.2-stable` |
| `bin/filebrowser` | `linux-arm64-filebrowser` | aarch64 | FileBrowser Quantum `v2.0.2-stable` |

## Why the executable is bundled

FileBrowser Quantum is a Go application with an embedded Vue frontend. The
upstream release publishes ready-to-run Linux executables. The build script
downloads the exact asset for the target architecture, verifies its SHA-256,
and places it unchanged at `/usr/local/filebrowser-quantum/bin/filebrowser`.
The TOS wrapper does not patch, re-sign, strip, or recompress it.

## Exact origin

- Project: https://github.com/gtsteffaniak/filebrowser
- Release tag: `v2.0.2-stable`
- Commit: `2c071d1e6eb48d4b88da2657885d345663a0a88b`
- Source archive:
  https://github.com/gtsteffaniak/filebrowser/archive/refs/tags/v2.0.2-stable.tar.gz
- Release workflow:
  https://github.com/gtsteffaniak/filebrowser/blob/v2.0.2-stable/.github/workflows/tag.yaml
- License: Apache License 2.0 (see `LICENSE` and `NOTICE`)

Downloaded assets and SHA-256 values:

| Platform | Upstream asset | SHA-256 |
| --- | --- | --- |
| x86_64 | `linux-amd64-filebrowser` | `5710dc6f51d77f1db884eace44f6952286c49f2ce40b6a59af37e0dc7c4a8bbd` |
| aarch64 | `linux-arm64-filebrowser` | `03eac074efc1b0ef3cb39882c04eeee26027049d261b6b6706650d4ac2d8e21c` |

The upstream release workflow compresses the published executables with UPX.
That is an upstream build property, not a change made by this wrapper. The
binary is statically linked and has no section headers, which is why it can
look stripped or packed to static analysis tools. `SBOM.spdx.json` records the
same files with their checksums, and `BUILD_PROVENANCE.md` records the build and
verification steps.

## Reproducing or reviewing

```bash
cd apps/tos7
python3 build.py --platform x86_64 --twice
python3 build.py --platform aarch64 --twice
```

The builder refuses to package an asset whose SHA-256 differs from the values
above. To review the binary independently, download the same upstream asset,
verify the checksum, and compare it byte-for-byte with `bin/filebrowser` from
the `.deb`. To build from source instead, use the upstream source archive and
the upstream Go build instructions for tag `v2.0.2-stable`.

Questions about this bundled binary can be raised at
https://github.com/642671/tos-filebrowser/issues.
