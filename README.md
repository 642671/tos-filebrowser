# FileBrowser Quantum for TOS 7

This is a **TerraMaster TOS 7 packaging wrapper** for the official
[FileBrowser Quantum](https://github.com/gtsteffaniak/filebrowser) file manager
(Apache-2.0).

It is not the upstream FileBrowser Quantum project. The official Linux
`x86_64` and `aarch64` binaries from the `v2.0.2-stable` release are packaged
unchanged. Copyright in FileBrowser Quantum remains with the upstream authors.
This repository only adds TOS 7 Deb packaging, a local Unix-socket reverse
proxy, systemd units, and a default configuration.

- Upstream: https://github.com/gtsteffaniak/filebrowser
- Upstream tag: `v2.0.2-stable`
- TOS / Debian package version: `2.0.4` (wrapper revision). The packaged
  software is still exactly upstream `v2.0.2-stable`. The `-stable` suffix is
  not a Debian version component.
- Corresponding source: https://github.com/gtsteffaniak/filebrowser/archive/refs/tags/v2.0.2-stable.tar.gz
- License: [Apache License 2.0](LICENSE)
- Attribution: see [NOTICE](NOTICE)

## What the TOS app does

The application is a TOS 7 iframe Deb (`kind=deb`, not Docker). The official
FileBrowser Quantum binary listens on `127.0.0.1` only. A thin Python 3.10+
standard-library proxy exposes it to the TOS portal through
`/var/api/filebrowser-quantum.sock` so the service is not published on a LAN
port.

The packaged application id is `filebrowser-quantum`. Separate packages are
built for `x86_64` and `aarch64`.

The package ships the TOS launcher page in `webui.bz2`. `postinst` removes any
previous extraction and unpacks the exact archive from the current package into
`/usr/local/filebrowser-quantum/webui`, so upgrades cannot leave a stale UI
behind. The launcher embeds the upstream WebUI through the TOS route
`/v2/proxy/filebrowser-quantum/`; the local proxy restores that prefix before
forwarding to the upstream server, whose `http.baseURL` is set to the same
path.

On first start:

- `apps/tos7/conf/config.yaml` is copied to
  `/usr/local/filebrowser-quantum/data/config.yaml` if that file does not exist.
  If common TOS volume paths such as `/mnt/md0` or `/Volume1` exist, they are
  added as extra sources in that first-run config only. Later upgrades do not
  overwrite a customized config.
- If no admin password was previously recorded, the launcher generates one,
  passes it to FileBrowser once via `FILEBROWSER_ADMIN_PASSWORD`, and writes
  `admin` plus the password to
  `/usr/local/filebrowser-quantum/data/INITIAL_ADMIN.txt` (mode 0600). Change
  that password at first login. The environment variable is not reused on later
  starts, so a password changed in the UI is kept.

Default username: `admin`.

## Build

Requirements: Python 3.10+ (the build uses only the standard library).
Network access is needed once to download the official release assets;
SHA-256 sums are verified before packaging.

```bash
cd apps/tos7
python3 build.py --platform x86_64 --twice
python3 build.py --platform aarch64 --twice
```

`--twice` builds the package two times and fails if the `.deb` bytes differ.
The builder also writes a `.sha256` sidecar and, when `dpkg-deb` is available,
runs `dpkg-deb --info` and `dpkg-deb --contents`.

Output:

- `apps/tos7/dist/filebrowser-quantum_2.0.4_x86_64.deb`
- `apps/tos7/dist/filebrowser-quantum_2.0.4_aarch64.deb`

Build directories, downloaded upstream binaries, and `.deb` files are gitignored
and must not be committed.

The builder verifies the packaged `webui.bz2` contents, the version query
strings, the systemd sandbox paths, the lifecycle scripts, and the recorded
upstream build provenance before writing the `.sha256` sidecar. See
[`apps/tos7/BUILD_PROVENANCE.md`](apps/tos7/BUILD_PROVENANCE.md) for the
upstream commit, release workflow, license, and downloaded asset hashes.

## Upstream assets (v2.0.2-stable)

| Platform | Official asset | SHA-256 |
| --- | --- | --- |
| x86_64 | [linux-amd64-filebrowser](https://github.com/gtsteffaniak/filebrowser/releases/download/v2.0.2-stable/linux-amd64-filebrowser) | `5710dc6f51d77f1db884eace44f6952286c49f2ce40b6a59af37e0dc7c4a8bbd` |
| aarch64 | [linux-arm64-filebrowser](https://github.com/gtsteffaniak/filebrowser/releases/download/v2.0.2-stable/linux-arm64-filebrowser) | `03eac074efc1b0ef3cb39882c04eeee26027049d261b6b6706650d4ac2d8e21c` |

## License

FileBrowser Quantum and this packaging are licensed under the Apache License
2.0. You must preserve the license, NOTICE, and upstream attribution when
redistributing.

## Privacy and uninstall

The privacy policy is published at [docs/PRIVACY.md](docs/PRIVACY.md) and is also shipped inside the package. The systemd unit keeps `/usr/local/filebrowser-quantum/data`, `/usr/local/filebrowser-quantum/logs`, and `/var/api` writable, and grants write access to `/Volume1` and other TOS volumes when they exist. Legacy `/mnt` is optional, so a missing path cannot prevent the service from starting with `226/NAMESPACE`.

The service handles `SIGTERM` by stopping the proxy, terminating the upstream process with a bounded wait, cleaning up the socket, and exiting normally. It does not rely on `SIGKILL` for a normal stop or disable.

TOS ships an `ffmpeg` build whose capability probe can take around 20 seconds on
ARM hardware. The launcher therefore waits up to 90 seconds for the upstream
listener on first start, and `postinst` uses the same readiness budget instead
of reporting a false failure.

Uninstalling the application removes `/usr/local/filebrowser-quantum` (including `data/INITIAL_ADMIN.txt`, the application database, cache, logs, and the extracted `webui` directory), the service user, the systemd unit, and `/var/api/filebrowser-quantum.sock`. It does **not** delete user files on NAS volume mounts such as `/mnt/md0` or `/Volume1`.
