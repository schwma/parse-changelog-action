const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const { trimLines } = require('./util')

const runAction = (context, version = '', changelogPath = 'CHANGELOG.md') => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'parse-changelog-action-'))
  context.after(() => fs.rmSync(directory, { recursive: true, force: true }))
  const outputPath = path.join(directory, 'output')
  fs.writeFileSync(outputPath, '')
  fs.writeFileSync(path.join(directory, 'CHANGELOG.md'), trimLines(`
    # Changelog

    ## Version 1.3.0 - tbd

    ### Changed

    - Latest change.

    ## Version 1.2.0 - 2024-06-25

    - Previous change.
  `))

  const result = spawnSync(process.execPath, [path.join(__dirname, '../index.js')], {
    cwd: directory,
    encoding: 'utf8',
    timeout: 10000,
    env: {
      ...process.env,
      INPUT_PATH: changelogPath,
      INPUT_VERSION: version,
      'INPUT_TITLE-REGEX': '^## .*$',
      'INPUT_VERSION-REGEX': '\\d+\\.\\d+\\.\\d+',
      GITHUB_OUTPUT: outputPath
    }
  })
  assert.ifError(result.error)
  return { ...result, output: fs.readFileSync(outputPath, 'utf8') }
}

test('action outputs the latest release with a tbd date when no version is supplied', context => {
  const result = runAction(context)
  assert.strictEqual(result.status, 0, result.stdout + result.stderr)
  assert.match(result.output, /^title<<([^\r\n]+)\r?\n## Version 1\.3\.0 - tbd\r?\n\1\r?$/m)
  assert.match(result.output, /^body<<([^\r\n]+)\r?\n### Changed\r?\n\r?\n- Latest change\.\r?\n\1\r?$/m)
})

test('action selects a release with a tbd date by version tag', context => {
  const result = runAction(context, 'v1.3.0')
  assert.strictEqual(result.status, 0, result.stdout + result.stderr)
  assert.match(result.output, /^title<<([^\r\n]+)\r?\n## Version 1\.3\.0 - tbd\r?\n\1\r?$/m)
  assert.match(result.output, /^body<<([^\r\n]+)\r?\n### Changed\r?\n\r?\n- Latest change\.\r?\n\1\r?$/m)
})

test('action outputs the requested release from a version tag', context => {
  const result = runAction(context, 'v1.2.0')
  assert.strictEqual(result.status, 0, result.stdout + result.stderr)
  assert.match(result.output, /^title<<([^\r\n]+)\r?\n## Version 1\.2\.0 - 2024-06-25\r?\n\1\r?$/m)
  assert.match(result.output, /^body<<([^\r\n]+)\r?\n- Previous change\.\r?\n\1\r?$/m)
})

test('action fails when the changelog is missing', context => {
  const result = runAction(context, '', 'missing.md')
  assert.strictEqual(result.status, 1)
  assert.match(result.stdout, /::error::The provided changelog file path does not exist: missing\.md/)
  assert.strictEqual(result.output, '')
})