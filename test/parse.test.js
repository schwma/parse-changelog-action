const test = require('node:test')
const assert = require('node:assert/strict')
const { parseReleases } = require('../src/parse')
const { trimLines } = require('./util')

test('parses release titles and keeps their bodies separate', () => {
  const changelog = trimLines(`
    # Changelog

    ## Version 1.3.0 - tbd

    ### Changed

    - Update the runtime.

    ## Version 1.2.0 - 2024-06-25

    - Previous release.
  `)

  assert.deepStrictEqual(parseReleases(changelog, /^## .*$/gm), [
    {
      title: '## Version 1.3.0 - tbd',
      body: '### Changed\n\n- Update the runtime.'
    },
    {
      title: '## Version 1.2.0 - 2024-06-25',
      body: '- Previous release.'
    }
  ])
})