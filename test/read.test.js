const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { readChangelog } = require('../src/read')

test('reads explicit and default changelogs and reports missing files', context => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'parse-changelog-'))
  const originalDirectory = process.cwd()
  context.after(() => {
    process.chdir(originalDirectory)
    fs.rmSync(directory, { recursive: true, force: true })
  })
  process.chdir(directory)

  fs.writeFileSync('release-notes.md', '# Release notes\n')
  assert.strictEqual(readChangelog('release-notes.md'), '# Release notes\n')

  assert.throws(() => readChangelog('missing.md'), /provided changelog file path does not exist/)
  assert.throws(() => readChangelog(), /A changelog could not be found/)

  fs.writeFileSync('CHANGELOG.md', '# Changelog\n')
  assert.strictEqual(readChangelog(), '# Changelog\n')
})