# Privacy Policy - FileBrowser Quantum for TOS 7

This policy describes how the TerraMaster TOS 7 packaging of **FileBrowser
Quantum** (`filebrowser-quantum`, package version 2.0.4) handles information.
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

This policy covers the TOS wrapper: its configuration, systemd unit, Unix
socket proxy, launcher page, lifecycle scripts, and documentation. The
upstream FileBrowser Quantum software is a separate project with its own
documentation. The wrapper does not add analytics, advertising, telemetry, or
cloud synchronization.

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
- **Operational logs.** Service output and installation diagnostics under
  `/usr/local/filebrowser-quantum/logs`, used to operate and troubleshoot the
  local service.

## Purposes and legal basis

The information is processed solely to run the application on the user's NAS:
authenticating local users, displaying and managing the configured file
sources, applying permissions, producing previews, creating shares requested
by the user, maintaining the local database and cache, and diagnosing service
or installation failures. The wrapper publisher does not use this information
for profiling, advertising, marketing, or any purpose unrelated to the local
application.

## Where data is stored

Application data is stored locally on the NAS, typically under
`/usr/local/filebrowser-quantum/data` and
`/usr/local/filebrowser-quantum/logs`. User files remain in the sources chosen
by the administrator, such as `/Volume1` or other mounted volumes. The wrapper
does not create a publisher-operated copy, backup, or cloud mirror of these
files.

## Network activity and sharing

The packaged FileBrowser Quantum binary listens only on the NAS loopback
interface. The TOS wrapper exposes it to the TOS portal through the local Unix
socket `/var/api/filebrowser-quantum.sock`. The wrapper itself does not send
file contents, credentials, logs, or usage statistics to the publisher or to
TerraMaster.

FileBrowser features selected by the administrator may create user-initiated
shares or connect to services configured by the administrator. Those actions
are controlled by the administrator and the upstream application, not by the
wrapper publisher. Anyone who can open the application and authenticate with a
FileBrowser account can access the sources and operations allowed for that
account.

## Retention and deletion

Configuration, accounts, the database, cache, previews, logs, and
`INITIAL_ADMIN.txt` remain on the NAS until the user changes or deletes them,
or until the application is uninstalled. Uninstalling the package stops and
disables the service and removes the wrapper's own directory
`/usr/local/filebrowser-quantum`, including its configuration, database,
cache, logs, and first-run credential file, together with the systemd unit,
the Unix socket, and the service user.

Uninstall does **not** delete user files stored on NAS volumes such as
`/Volume1`, `/Volume2`, or legacy `/mnt` mounts. Backups, snapshots, or copies
created by the user or by other NAS features are outside this package and are
not removed by it.

## User rights and choices

The NAS administrator can inspect, export, correct, or delete application data
through the TOS file manager, the FileBrowser administration interface, or by
uninstalling the package. Because the publisher does not receive this data,
there is no publisher-side copy to access, correct, or erase. Requests about
the wrapper can be raised through the repository issue tracker listed below.

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
described here occurs on the user's NAS. If the administrator configures an
upstream feature or external service that transmits data, that transfer is
chosen and controlled by the administrator.

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

Questions or concerns about this wrapper's privacy practices can be raised at
[github.com/642671/tos-filebrowser/issues](https://github.com/642671/tos-filebrowser/issues).
Do not include passwords, private file contents, or other sensitive data in a
public issue.
