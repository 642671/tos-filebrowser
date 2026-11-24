# Privacy Policy - FileBrowser Quantum for TOS 7

This policy describes how the TerraMaster TOS 7 packaging of **FileBrowser
Quantum** (`filebrowser-quantum`, package version 2.0.5) handles information.
The application is installed and runs entirely on the user's own TerraMaster
NAS. The wrapper publisher does not operate a cloud account service for this
application and does not receive a copy of files, credentials, logs, or usage
data created by a local installation.

## Provider and scope

This package is an independent TOS 7 wrapper around the official
[FileBrowser Quantum](https://github.com/gtsteffaniak/filebrowser) project
(Apache-2.0). The wrapper is published by the independent publisher
**qishiyi** through
[github.com/642671/tos-filebrowser](https://github.com/642671/tos-filebrowser).
It is not a TerraMaster official application and is not endorsed by
TerraMaster.

This policy covers the TOS wrapper and the behaviour of the packaged upstream
release. The wrapper itself adds no analytics, advertising, telemetry, or cloud
synchronization. The upstream application includes an optional anonymous
deployment analytics feature, described below, and an update check that this
package disables by default.

## Information processed on the NAS

The application processes only the information needed to provide local file
browsing and sharing:

- **Account data.** The FileBrowser administrator account and any additional
  users created by the administrator, including usernames, password hashes,
  roles, and permissions. Passwords are handled by the upstream application;
  the wrapper does not transmit them.
- **Application configuration.** File sources, permissions, sharing options,
  server settings, and the first-run administrator record.
- **File and folder data.** Names, paths, sizes, timestamps, previews, and
  content of files that the administrator explicitly adds as FileBrowser
  sources. The application can read, modify, create, and delete files in
  those sources when the signed-in account has permission.
- **Application state.** The FileBrowser database, cache, temporary upload
  files, generated previews, and the first-run credential file
  `INITIAL_ADMIN.txt`.
- **Operational logs.** Service output and installation diagnostics under the
  application log directory, used to operate and troubleshoot the local
  service.

## Optional upstream deployment analytics

The packaged upstream release can send an anonymous deployment snapshot. This
feature is **disabled by default for a new installation** and only runs if an
administrator explicitly enables it in the FileBrowser settings. When enabled,
the upstream binary sends a snapshot every 30 days, starting 24 hours after
the feature is enabled, to `https://api.filebrowserquantum.com/v1/events`.

The snapshot contains:

- a randomly generated installation identifier;
- the FileBrowser version and commit identifier;
- operating system, CPU architecture, CPU core count, total memory, resident
  memory, and a deployment-runtime label;
- aggregate counts of enabled, read-only, and private sources, users, access
  rules, active shares, and custom themes;
- boolean authentication and integration settings (for example password,
  OIDC, LDAP, passkeys, OnlyOffice, media previews);
- feature flags, aggregate indexing statistics (file and directory counts,
  scan durations), and database file sizes.

The snapshot does not contain file contents, file names, source paths,
usernames, passwords, tokens, or log entries. The wrapper publisher does not
operate this endpoint and does not receive a copy. An administrator who does
not want this transfer must leave the option disabled.

## Update check

The upstream binary can query GitHub for release tags. The shipped
`config.yaml` sets `server.disableUpdateCheck: true`, so the package does not
contact GitHub for updates. If an administrator changes that setting, the
server may contact `api.github.com` and `github.com` to compare release tags.
That request carries the NAS network address and a FileBrowser user agent but
no file, account, or usage content.

## Third-party components and bundled binary

| Component | Version | License | Role in the package |
| --- | --- | --- | --- |
| FileBrowser Quantum (upstream) | `v2.0.2-stable` (commit `2c071d1e6eb48d4b88da2657885d345663a0a88b`) | Apache-2.0 | `bin/filebrowser`, the upstream server and its embedded frontend |
| Python standard library wrapper | Python 3.10+ | PSF License | TOS service launcher, config migration, graceful shutdown, first-run admin record |
| systemd, nginx, `/var/api` socket | platform-provided by TOS | TerraMaster | service supervision, portal route, platform proxy |

The bundled executable is not built by this repository. `apps/tos7/build.py`
downloads the exact upstream asset for the target architecture, verifies its
SHA-256, and ships it unchanged; the upstream release workflow compresses it
with UPX. `THIRD_PARTY.md` and `SBOM.spdx.json`, installed at
`/usr/local/filebrowser-quantum/` and shipped in this package, record the
origin, commit, checksums and reproduction steps. The wrapper adds no other
third-party libraries and no analytics SDK.

## Purposes and legal basis

The information is processed solely to run the application on the user's NAS:
authenticating local users, displaying and managing the configured file
sources, applying permissions, producing previews, creating shares requested
by the user, maintaining the local database and cache, and diagnosing service
or installation failures. The wrapper publisher does not use this information
for profiling, advertising, marketing, or any purpose unrelated to the local
application.

## Where data is stored

TOS installs application data on an application volume, normally
`/Volume1/@apps/filebrowser-quantum`, and creates
`/usr/local/filebrowser-quantum` as a link to it. Configuration, the database,
cache, previews, logs, the extracted launcher WebUI, and `INITIAL_ADMIN.txt`
are stored in that application directory. `/usr/www/filebrowser-quantum` is a
link to the extracted launcher WebUI. User files remain in the sources chosen
by the administrator, such as `/Volume1` or other mounted volumes outside the
`@apps` directory. The wrapper does not create a publisher-operated copy,
backup, or cloud mirror of these files.

## Network activity and sharing

The packaged FileBrowser Quantum binary listens only on the NAS loopback
interface. The TOS wrapper exposes it through two local routes: an nginx route
under the portal origin for the embedded window, and the Unix socket
`/var/api/filebrowser-quantum.sock` for platform compatibility. The wrapper
does not send file contents, credentials, logs, or usage statistics to the
publisher or to TerraMaster.

FileBrowser features selected by the administrator may create user-initiated
shares or connect to services configured by the administrator. Those actions
are controlled by the administrator and the upstream application, not by the
wrapper publisher. Anyone who can open the application and authenticate with a
FileBrowser account can access the sources and operations allowed for that
account.

## Retention and deletion

Configuration, accounts, the database, cache, previews, logs, the extracted
WebUI, and `INITIAL_ADMIN.txt` remain on the NAS until the user changes or
deletes them, or until the application is uninstalled.

Uninstalling the package stops and disables the service and removes the
application's own data. This applies both to an uninstall that keeps settings
and to an uninstall that deletes settings: the TOS package contract requires
no application configuration or data to remain. The removal covers:

- the resolved application directory, normally
  `/Volume1/@apps/filebrowser-quantum` (or the equivalent `@apps` directory on
  another volume or legacy `/mnt` mount), including `data/config.yaml`, the
  database, cache, previews, logs, `INITIAL_ADMIN.txt`, and `webui/`;
- the `/usr/local/filebrowser-quantum` and `/usr/www/filebrowser-quantum`
  links;
- the systemd unit, the Unix socket, and the nginx portal route;
- the service user and group created for this application.

Uninstall does **not** delete user files stored on NAS volumes outside the
application `@apps` directory, such as `/Volume1`, `/Volume2`, or legacy
`/mnt` mounts. Backups, snapshots, or copies created by the user or by other
NAS features are outside this package and are not removed by it.

## User rights and choices

The NAS administrator can inspect, export, correct, or delete application data
through the TOS file manager, the FileBrowser administration interface, or by
uninstalling the package. Because the publisher does not receive this data,
there is no publisher-side copy to access, correct, or erase. Requests about
the wrapper can be raised through the repository issue tracker listed below.

## Permissions and system access

| Capability | Purpose |
| --- | --- |
| Read the configured file sources | index and display names, sizes, timestamps, previews and content of files the administrator added |
| Write, rename and delete inside those sources | only when the signed-in account performs an upload, edit, rename or delete; permissions are enforced by FileBrowser |
| Read and write the application directory | `config.yaml`, database, cache, previews, logs, extracted WebUI, `INITIAL_ADMIN.txt` |
| Listen on loopback and create a Unix socket | serve the UI to the TOS portal route and the platform proxy |
| Install an nginx route under `/filebrowser-quantum/` | expose the embedded window on the portal origin |
| Run as the dedicated user `filebrowser-quantum` | least privilege; the service does not run as root |

The package does not request access outside these paths, does not open a LAN
port, and does not change network configuration. Logs written under the
application log directory and the systemd journal are not rotated or expired by
the package; the administrator can delete them at any time.

## Security

The service runs as the dedicated non-root user `filebrowser-quantum` with a
restricted systemd sandbox. Application data is kept under the application
directory, and the local socket is used instead of publishing a LAN port. The
administrator is responsible for strong account passwords, network exposure,
TOS access controls, volume permissions, and backups. The first-run password in
`INITIAL_ADMIN.txt` should be changed immediately after the first login, and
the file should be removed once it is no longer needed.

## International transfers

The wrapper does not transfer personal data internationally. All processing
described here occurs on the user's NAS. The optional upstream analytics and
update check described above are the only package-initiated external requests;
they are disabled by default (analytics) or disabled in the shipped
configuration (update check). If the administrator configures an upstream
feature or external service that transmits data, that transfer is chosen and
controlled by the administrator.

## Children

This application is intended for NAS administration and general file
management. It is not directed to children, and the publisher does not
knowingly collect information from children.

## Changes to this policy

The policy applicable to a package version is the copy shipped in that package
at `/usr/local/filebrowser-quantum/docs/PRIVACY.md` and published at
[docs/PRIVACY.md](https://github.com/642671/tos-filebrowser/blob/main/docs/PRIVACY.md).
Material changes are made in a new package version and noted in its release
notes.

## Contact

Publisher: qishiyi
Email: qishiyi77@gmail.com
Issues: [github.com/642671/tos-filebrowser/issues](https://github.com/642671/tos-filebrowser/issues)

Questions or concerns about this wrapper's privacy practices can be raised by
email or through the issue tracker. Do not include passwords, private file
contents, or other sensitive data in a public issue.
