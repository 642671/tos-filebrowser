# Privacy Policy — FileBrowser Quantum for TOS 7

This policy describes how the TOS 7 packaging of **FileBrowser Quantum** (`filebrowser-quantum`) handles information. The application is installed and runs on the user's own TerraMaster NAS. The packager of this TOS wrapper does not operate a cloud account service for the app and does not receive a copy of data created by a local installation.

## Who provides the application

This package is a TOS 7 wrapper around official [FileBrowser Quantum](https://github.com/gtsteffaniak/filebrowser) (Apache-2.0). The wrapper is published by the independent publisher **qishiyi** through [github.com/642671/tos-filebrowser](https://github.com/642671/tos-filebrowser). This is not a TerraMaster official application. No company legal department or formal postal privacy contact is claimed here. Questions about this wrapper's policy can be opened as issues on the wrapper repository.

## What the application does

FileBrowser Quantum lets a NAS administrator browse, preview, and share files through a TOS window. The official binary listens only on the NAS loopback interface. A local proxy exposes it to the TOS portal through `/var/api/filebrowser-quantum.sock`.

## Information stored on this NAS

The wrapper and FileBrowser Quantum may store application data only on this NAS, typically under `/usr/local/filebrowser-quantum/data` and `/usr/local/filebrowser-quantum/logs`, including:

- application configuration and the FileBrowser database
- application cache files
- the first-run administrator password file `INITIAL_ADMIN.txt`, until you change or delete it
- files placed in the application's own default folder `/usr/local/filebrowser-quantum/data/files`
- service logs and install diagnostic files

The application does not require you to create an account with the wrapper publisher. Sign-in accounts created inside FileBrowser are stored in the application's database on this NAS.

## Access to NAS volumes

On first start, if common TOS volume paths such as `/mnt/md0` or `/Volume1` exist, they may be added as additional file sources in the first-run configuration only. The application can then read and write files in the sources the administrator enables. Those volume files remain the user's NAS data. This wrapper does not copy them off the NAS to the publisher.

## What is not sent to the publisher

This packaging does not send file contents, share links, credentials, or logs to the publisher, to TerraMaster, or to a publisher analytics service. Share links created in FileBrowser are provided by the application running on this NAS.

## Access on this NAS

Anyone who can open the application and authenticate with a FileBrowser account can use the permissions granted to that account.

## Retention and uninstall

Application configuration, the FileBrowser database, cache, and `INITIAL_ADMIN.txt` remain until the user changes them or uninstalls the application. Uninstalling the package stops the service and removes this application's own configuration, database, cache, logs, initial password file, Unix socket, systemd unit, and service user under `/usr/local/filebrowser-quantum`.

Uninstall does **not** delete user files that live on NAS volume mounts such as `/mnt/md0` or `/Volume1`. Only this application's own directory and service identity are removed.

## Changes

The current policy for a given package version is the copy shipped in that package at `/usr/local/filebrowser-quantum/docs/PRIVACY.md`, also published at [docs/PRIVACY.md](https://github.com/642671/tos-filebrowser/blob/main/docs/PRIVACY.md).
