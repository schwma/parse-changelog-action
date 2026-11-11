const test = require('node:test')
const assert = require('node:assert/strict')
const { parseReleases } = require('../src/parse')

const trimLines = text => text.split('\n').map(line => line.trim()).join('\n').trim()

test('parses release titles and keeps their bodies separate', () => {
  const changelog = trimLines(`
    # Changelog

    ## Version 1.3.0

    ### Changed

    - Update the runtime.

    ## Version 1.2.0

    - Previous release.
  `)

  assert.deepStrictEqual(parseReleases(changelog, /^## .*$/gm), [
    {
      title: '## Version 1.3.0',
      body: '### Changed\n\n- Update the runtime.'
    },
    {
      title: '## Version 1.2.0',
      body: '- Previous release.'
    }
  ])
})