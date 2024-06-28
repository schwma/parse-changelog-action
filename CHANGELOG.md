# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Version 1.3.0 - tbd

### Added

### Changed

### Fixed

### Removed

## Version 1.2.0 - 2024-06-25

### Changed

- Workflow now uses `node20` for execution since `node22` isn't supported yet

## Version 1.1.0 - 2024-06-25

### Changed

- Workflow now uses `node22` for execution.

## Version 1.0.0 - 2023-02-26

### Added

- `version-regex` input that defines the regex that is used to match versions from the `version` input and release titles which are then compared to find a specific release

### Changed

- Non-digit and period characters are no longer stripped from the `version` input. Instead the `version-regex` is used.

## Version 0.1.0 - 2023-02-25

### Added

- Parsing of changelogs
- Finding the latest release or supplying a `version`
- Parsing the `title` and `body` from the release
