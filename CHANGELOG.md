# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [6.1.2](../../tags/v6.1.2) - 2025-07-24
### Changed
- Fix vulnerable dependencies

## [6.1.1](../../tags/v6.1.1) - 2025-06-12
### Added
- `mockPartial` to mimic partial type as an underlying type

## [6.0.0](../../tags/v6.0.0) - 2025-05-18
__(BREAKING) Dropped support for NodeJS 18 (EOL). Minimum required version is now NodeJS 20.__

### Added
- `toMatchFiles` to compare contents of the specified directory with an expected object
### Changed
- Migrated to NodeJS 20.19
- Migrated to ESLint V9 flat configs
- Updated dependencies

## [5.0.5](../../tags/v5.0.5) - 2024-03-26
### Changed
- Update dependencies

## [5.0.4](../../tags/v5.0.4) - 2024-03-26
### Removed
- Cleanup README.md

## [5.0.3](../../tags/v5.0.3) - 2024-03-20
### Changed
- Update dependencies

## [5.0.2](../../tags/v5.0.2) - 2024-03-20
### Changed
- Fix README.md to change installation recommendations since jest and jest-related packages are not meant to be installed in production
- Update dependencies

## [5.0.1](../../tags/v5.0.1) - 2024-03-16
### Changed
- Use dedicated .eslintignore

## [5.0.0](../../tags/v5.0.0) - 2024-03-16
### Changed
- Update eslint config and raise minimum supported NodeJS version to match one in typescript-eslint plugin
- Update .npmignore
- Unify jest.config.js by removing redundant patterns and providing support for both ts and tsx
### Removed
- Remove utils/fs in favor of mock-fs npm package

## [4.0.3](../../tags/v4.0.3) - 2024-01-30
### Changed
- Migrate to GitHub

## [4.0.2](../../tags/v4.0.2) - 2024-01-30
### Changed
- Fix typo in README.md

## [4.0.1](../../tags/v4.0.1) - 2024-01-29
### Changed
- Explicitly specify ignores from .gitignore in .eslintrc.js

## [4.0.0](../../tags/v4.0.0) - 2024-01-15
### Changed
- Revert ESM

## [3.0.2](../../tags/v3.0.2) - 2024-01-14
### Added
- Add .npmignore

## [3.0.1](../../tags/v3.0.1) - 2024-01-14
### Added
- Update dependencies

## [3.0.0](../../tags/v3.0.0) - 2024-01-14
### Changed
- Migrate to ESM
- Update dependencies

## [2.1.1](../../tags/v2.1.1) - 2024-01-02
### Added
- `mockFS` to mock file system and generate mock functions for fs module

## [2.0.1](../../tags/v2.0.1) - 2023-11-12
### Changed
- Update dependencies

## [2.0.0](../../tags/v2.0.0) - 2023-09-24
### Changed
- Make Structure exclude functions instead of having them as never
- Update dependencies with breaking changes

## [1.0.0](../../tags/v1.0.0) - 2023-09-11
### Changed
- First release
