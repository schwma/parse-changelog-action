const test = require('node:test')
const assert = require('node:assert/strict')
const { updateChangelog } = require('../scripts/changelog')
const { trimLines } = require('./util')

const previous = '## Version 1.2.1 - 2026-11-11\n\n### Changed\n\n- Previous change.\n'

test('dates release notes and removes empty sections without changing older releases', () => {
  const changelog = trimLines(`
    # Changelog

    ## Version 1.3.0 - tbd

    ### Added

    ### Changed

    - New change.

    ### Fixed

    ### Removed
  `) + '\n\n' + previous

  assert.strictEqual(updateChangelog(changelog, '1.3.0', 'release', '2026-11-12'),
    '# Changelog\n\n## Version 1.3.0 - 2026-11-12\n\n### Changed\n\n- New change.\n\n' + previous)
})

test('adds the next release template without changing existing notes', () => {
  assert.strictEqual(updateChangelog('# Changelog\n\n' + previous, '1.3.0', 'post-release'),
    '# Changelog\n\n## Version 1.3.0 - tbd\n\n### Added\n\n### Changed\n\n### Fixed\n\n### Removed\n\n' + previous)
})

test('rejects empty notes, mismatched versions, and duplicate next releases', () => {
  assert.throws(() => updateChangelog('## Version 1.3.0 - tbd\n\n### Added\n', '1.3.0', 'release'), /Add release notes/)
  assert.throws(() => updateChangelog(previous, '1.3.0', 'release'), /Expected/)
  assert.throws(() => updateChangelog(previous, '1.2.1', 'post-release'), /Bump package.json first/)
})