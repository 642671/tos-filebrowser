# FileBrowser Quantum for TOS 7

This is a **TerraMaster TOS 7 packaging wrapper** for the official
[FileBrowser Quantum](https://github.com/gtsteffaniak/filebrowser) file manager
(Apache-2.0).

It is not the upstream FileBrowser Quantum project. The official Linux
`x86_64` and `aarch64` binaries from the `v2.0.2-stable` release are packaged
unchanged. Copyright in FileBrowser Quantum remains with the upstream authors.
This repository only adds TOS 7 Deb packaging, a local Unix-socket reverse
proxy, an nginx portal route, systemd units, and a default configuration.

- Upstream: https://github.com/gtsteffaniak/filebrowser
- Upstream tag: `v2.0.2-stable`
- TOS / Debian package version: `2.0.5` (wrapper revision). The packaged
  software is still exactly upstream `v2.0.2-stable`. The `-stable` suffix is
  not a Debian version component.
- Corresponding source: https://github.com/gtsteffaniak/filebrowser/archive/refs/tags/v2.0.2-stable.tar.gz
- License: [Apache License 2.0](LICENSE)
- Attribution: see [NOTICE](NOTICE)

## What the TOS app does

The application is a TOS 7 iframe Deb (`application_type=deb`, not Docker).
The official FileBrowser Quantum binary listens on `127.0.0.1:18742` only. A
thin Python 3.10+ standard-library proxy exposes it to the TOS portal through
`/var/api/filebrowser-quantum.sock` for platform compatibility.

The launcher page is served by TOS at `/filebrowser-quantum/` from
`webui.bz2`. The iframe loads the application at
`/filebrowser-quantum/ui/`. That route is provided by
[`apps/tos7/nginx/filebrowser-quantum.conf`](apps/tos7/nginx/filebrowser-quantum.conf),
which `postinst` deploys to `/etc/nginx/conf.d/filebrowser-quantum.conf` after
`nginx -t` validation and an nginx reload.

The launcher deliberately does **not** navigate the iframe through
`/v2/proxy/filebrowser-quantum/`. TOS requires the platform `X-Csrf-Token`
header on that route, and a normal browser document navigation cannot attach
it, so TOS returns HTTP 403 and the window stays blank. The application's own
nginx route is same-origin, works with FileBrowser's session cookies and
WebSocket, and is the route used by the launcher.

The wrapper no longer hides the loading layer just because an iframe `load`
event fired. It polls `/filebrowser-quantum/ui/health`, checks that the
embedded document actually contains the FileBrowser application shell, and
shows an explicit error with the failing health result and render state after
25 seconds. A Retry button reloads the frame.

If the package is upgraded from 2.0.4, the launcher rewrites the previous
`http.baseURL` in the existing `data/config.yaml` to the new application path.
The shipped configuration also sets `server.disableUpdateCheck: true`.

## First start

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

- `apps/tos7/dist/filebrowser-quantum_2.0.5_x86_64.deb`
- `apps/tos7/dist/filebrowser-quantum_2.0.5_aarch64.deb`

Build directories, downloaded upstream binaries, and `.deb` files are gitignored
and must not be committed.

The builder verifies the packaged `webui.bz2` contents, the version query
strings, the absence of `/v2/proxy/` in the launcher, the nginx route, the
systemd sandbox paths, the lifecycle scripts, the SPDX SBOM, and the recorded
upstream build provenance before writing the `.sha256` sidecar. See
[`apps/tos7/BUILD_PROVENANCE.md`](apps/tos7/BUILD_PROVENANCE.md),
[`apps/tos7/docs/THIRD_PARTY.md`](apps/tos7/docs/THIRD_PARTY.md), and the
generated `SBOM.spdx.json` inside the package.

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

The privacy policy is published at [docs/PRIVACY.md](docs/PRIVACY.md) and is
also shipped inside the package. It describes the optional upstream anonymous
deployment analytics (disabled by default), the disabled update check, and the
exact uninstall behaviour.

The systemd unit keeps `/usr/local/filebrowser-quantum/data`,
`/usr/local/filebrowser-quantum/logs`, and `/var/api` writable, and grants
write access to `/Volume1` and other TOS volumes when they exist. Legacy
`/mnt` is optional, so a missing path cannot prevent the service from starting
with `226/NAMESPACE`.

The service handles `SIGTERM` by stopping the proxy, terminating the upstream
process with a bounded wait, cleaning up the socket, and exiting normally. It
does not rely on `SIGKILL` for a normal stop or disable.

TOS ships an `ffmpeg` build whose capability probe can take around 20 seconds on
ARM hardware. The launcher therefore waits up to 90 seconds for the upstream
listener on first start, and `postinst` uses the same readiness budget instead
of reporting a false failure.

TOS installs application data at `/Volume1/@apps/filebrowser-quantum` (or the
equivalent `@apps` directory on another volume) and makes
`/usr/local/filebrowser-quantum` a link to it. Uninstall resolves that link and
removes the real application directory, including `data/config.yaml`, the
database, cache, logs, `INITIAL_ADMIN.txt`, and `webui/`. It also removes the
`/usr/www/filebrowser-quantum` link, the nginx route, the systemd unit, the
socket, and the service user. It does **not** delete user files stored on NAS
volumes outside the application `@apps` directory.
