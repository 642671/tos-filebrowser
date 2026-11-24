# FileBrowser Quantum 2.0.5 submission notes

## Review items addressed

| Item | Change |
| --- | --- |
| OPEN-403 / white screen | The launcher iframe now loads `/filebrowser-quantum/ui/` through the package's own nginx route. It no longer navigates a document through `/v2/proxy/filebrowser-quantum/`, which TOS rejects with HTTP 403 because a document navigation cannot send the platform `X-Csrf-Token` header. |
| Loading hides failures | `frontend/app.js` polls the app health endpoint, checks that the embedded document contains the rendered FileBrowser application shell, and shows an explicit error with the health and render state after 25 seconds. It never hides the loading layer on `load` alone. A Retry button reloads the frame. |
| V6 bundled executable | Added an SPDX 2.3 SBOM (`/usr/local/filebrowser-quantum/SBOM.spdx.json`), expanded `BUILD_PROVENANCE.md`, and added `docs/THIRD_PARTY.md` with the exact upstream release URL, commit, purpose, per-architecture SHA-256, and the upstream UPX note. The Debian control file declares the bundled binary and provenance paths. |
| F4 uninstall residue | `postrm` resolves `/usr/local/filebrowser-quantum` and `/usr/www/filebrowser-quantum` and removes their real targets, not only the symlinks. It also removes `/Volume*/@apps/filebrowser-quantum` and `/mnt/*/@apps/filebrowser-quantum`. |
| F11 app data and credentials | The same cleanup removes `data/config.yaml`, the SQLite database, cache, previews, logs, `INITIAL_ADMIN.txt`, and the extracted `webui/`, plus the nginx route, unit, socket, and service user. |
| C6 privacy policy | The policy now states the real data locations and uninstall behaviour. It also discloses the optional upstream anonymous deployment analytics (disabled by default) and the shipped `disableUpdateCheck: true`. |

## Package versions and hashes

Rebuilt on 2026-11-24 after the privacy-policy update (third-party components,
permissions/log-retention sections, contact email). Both architectures are
byte-identical across consecutive builds (`--twice`), `TOSAppSelfTestingTool -c`
reports `check passed` (exit 0) for both debs, and `.spec-audit/audit.py`
passes. The packages contain the updated `docs/PRIVACY.md`. Device regression
is still pending.

| Platform | File | Size | SHA-256 |
| --- | --- | --- | --- |
| x86_64 | `filebrowser-quantum_2.0.5_x86_64.deb` | 27,411,222 | `4d20d046e49c0526a232d484b82b4e5f4f0feaa32a3808740e60578e37bf27c4` |
| aarch64 | `filebrowser-quantum_2.0.5_aarch64.deb` | 25,711,088 | `e997c69c72dcd3eb3189e45603759340d9247d608d53fac04e3c42961930ba5e` |

Upstream binaries are unmodified official `v2.0.2-stable` release assets:

- x86_64 `5710dc6f51d77f1db884eace44f6952286c49f2ce40b6a59af37e0dc7c4a8bbd`
- aarch64 `03eac074efc1b0ef3cb39882c04eeee26027049d261b6b6706650d4ac2d8e21c`

## Local verification completed

- `python3 build.py --platform x86_64 --twice` and `--platform aarch64 --twice`: both builds are byte-identical across consecutive runs.
- `TOSAppSelfTestingTool -c`: `check passed` for both debs, exit code 0. File integrity 7/7 and file conformance 31/31.
- `.spec-audit/audit.py tos-filebrowser/apps/tos7`: PASS on all checked items; only the pre-existing informational warning about the sideload user-creation fallback remains.
- `sh -n` on `postinst`, `prerm`, and `postrm`; `node --check` on `frontend/app.js`; `py_compile` on the launcher and proxy.
- Local end-to-end harness with the real x86_64 upstream binary and the packaged launcher:
  - `/filebrowser-quantum/` returns the launcher page.
  - `/filebrowser-quantum/ui/` returns the FileBrowser SPA.
  - `/filebrowser-quantum/ui/health` returns `{"message":"ok"}`.
  - Headless Chrome renders the FileBrowser login page inside the launcher; loading is hidden and the error panel stays hidden.
  - With the upstream service stopped, the launcher shows the explicit 25-second error instead of a white screen.
- Unix-socket proxy compatibility:
  - `/v2/proxy/filebrowser-quantum/health` returns 200 `{"message":"ok"}`.
  - `/health`, `/filebrowser-quantum/ui/health`, and `/filebrowser-quantum/ui/` also return 200.
- Simulated TOS uninstall layout: a symlinked `/usr/local/filebrowser-quantum` pointing at `/Volume1/@apps/filebrowser-quantum`, plus `/usr/www/filebrowser-quantum`, nginx conf, and socket. `postrm remove` removed the resolved data directory (including `data/config.yaml`, SQLite, `INITIAL_ADMIN.txt`, and `webui/`), both symlinks, the nginx conf, and the socket.

## Device validation

x86_64 final-package regression on 192.168.2.134 (TOS 7, clean machine, no
prior app packages) passed on 2026-11-24:

- remote `sha256sum` matched `4d20d046...`; `dpkg -i` succeeded
- `filebrowserquantum-system.service` active and enabled; `postinst` reported
  the socket ready after 4 seconds
- `127.0.0.1:18742` listening; service runs as non-root uid 997; socket owned
  `filebrowser-quantum:allusers`, mode 660
- `/filebrowser-quantum/` returned 200 (1,233 bytes);
  `/filebrowser-quantum/ui/` returned 200 with the real SPA (15,989 bytes);
  `/filebrowser-quantum/ui/health` returned `{"message":"ok"}`
- `systemctl stop`, `start`, `disable`, `enable` all behaved correctly
- `dpkg --purge` removed the directories, unit, socket, nginx route, service
  user, process, and port; `dpkg -l` clean; `nginx -t` still passed
- known observation, intentionally deferred to the next version (coordinator
  decision): the non-root service logs ERROR for unreadable `/Volume1`
  subdirectories during the first index

aarch64 has no ARM hardware regression yet and is intentionally not submitted.

## TDP submission

The 2.0.4 x86_64 and aarch64 versions were withdrawn by the coordinator before
this submission, so there is no withdraw step. Only x86_64 2.0.5 is submitted;
the aarch64 build stays out of TDP until an ARM device regression is possible.


## TDP preflight (2026-11-24)

Read-only checks with the developer personal token succeeded. The token was
passed through curl --config and was not printed.

| Platform | App UUID | Current version | Current version UUID | Version status |
| --- | --- | --- | --- | --- |
| x86_64 | 73091c21-e287-49b9-aa81-947339dd6411 | 2.0.4 | 494d457d-8272-4964-a751-21cd0886ce64 | withdrawn by coordinator |
| aarch64 | e1088860-eb3d-4242-9c23-a78294bdd4d1 | 2.0.4 | 03d323e1-db8a-4118-a8da-9d64f35454d6 | withdrawn by coordinator |

Planned submission payload (after device validation and GitHub Release):

    {"tag":"v2.0.5","browser_download_url":"https://github.com/642671/tos-filebrowser/releases/download/v2.0.5/filebrowser-quantum_2.0.5_x86_64.deb"}

Create the x86_64 2.0.5 version, poll the task, compare the parse result with
the hash and release notes below, and only then confirm. The aarch64 payload is
prepared for later, after ARM hardware verification.

Submission result: task `c1ff18bc-b2e2-454c-b3e1-de48a982f284` passed on the
first poll. Parse Result: name `FileBrowser Quantum`, version `2.0.5`,
platform `x86_64`, size 27,411,222, SHA-256
`4d20d046e49c0526a232d484b82b4e5f4f0feaa32a3808740e60578e37bf27c4`, complete
release notes. Confirmed Version `3d74c6f9-85b9-418b-937b-42782ce1dfa4`,
status `0` (reviewing). App record `73091c21-e287-49b9-aa81-947339dd6411`
now reports `current_version=2.0.5`, `versions_status=1`.

## GitHub Release body

FileBrowser Quantum 2.0.5 for TOS 7 (wrapper revision; upstream remains
v2.0.2-stable)

- Fix the blank App Center window. The launcher now loads the application's own
  same-origin portal path /filebrowser-quantum/ui/ instead of a /v2/proxy
  document navigation that TOS rejects with HTTP 403.
- Verify service health and real rendering in the launcher, and show an explicit
  error with Retry after 25 seconds instead of hiding the loading layer when the
  iframe fails.
- Keep the Unix-socket /v2/proxy compatibility route for platform tooling, but
  do not use it for the iframe.
- Remove configuration, database, cache, INITIAL_ADMIN.txt and webui from the
  resolved application volume on uninstall, plus the unit, socket, nginx route,
  and service user.
- Add an SPDX 2.3 SBOM and document the bundled upstream binary origin, purpose,
  per-architecture SHA-256, and upstream UPX build property.
- Align the privacy policy with the real data locations, uninstall behaviour,
  disabled update check, disabled-by-default upstream analytics, bundled
  components, and the permissions/log-retention sections.
- Fix all 14 language descriptions and release notes for 2.0.5.

Assets: filebrowser-quantum_2.0.5_x86_64.deb and
filebrowser-quantum_2.0.5_aarch64.deb, each with a .sha256 sidecar.
