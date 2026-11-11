const test = require('node:test')
const assert = require('node:assert/strict')
const { getLatestRelease, getReleaseForVersion } = require('../src/release')

const releases = [
  { title: '## Version 1.3.0', body: 'Latest release.' },
  { title: '## Version 1.2.0', body: 'Previous release.' }
]

test('selects the first release as the latest', () => {
  assert.strictEqual(getLatestRelease(releases), releases[0])
})

test('selects a release by version', () => {
  assert.strictEqual(getReleaseForVersion(releases, '1.2.0', /\d+\.\d+\.\d+/), releases[1])
})

test('returns undefined when the requested version is missing', () => {
  assert.strictEqual(getReleaseForVersion(releases, '9.0.0', /\d+\.\d+\.\d+/), undefined)
})