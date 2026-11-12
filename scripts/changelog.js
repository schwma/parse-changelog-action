const fs = require('node:fs')
const path = require('node:path')

const updateChangelog = (changelog, version, mode, date = new Date().toISOString().slice(0, 10)) => {
  if (mode !== 'release' && mode !== 'post-release') throw new Error('Expected release or post-release')

  const start = changelog.search(/^## Version /m)
  if (start === -1) throw new Error('No release heading found in CHANGELOG.md')
  const prefix = changelog.slice(0, start)
  const releases = changelog.slice(start).split(/(?=^## Version )/m)
  const heading = `## Version ${version} - tbd`

  if (mode === 'post-release') {
    if (releases.some(release => release.startsWith(`## Version ${version} - `))) {
      throw new Error(`Version ${version} already exists in CHANGELOG.md. Bump package.json first.`)
    }
    return `${prefix}${heading}\n\n### Added\n\n### Changed\n\n### Fixed\n\n### Removed\n\n${releases.join('')}`
  }

  const [title, ...lines] = releases[0].split('\n')
  if (title !== heading) throw new Error(`Expected ${heading} as the first release heading`)
  const body = lines.join('\n')
    .split(/(?=^### )/m)
    .filter(section => !/^### (Added|Changed|Fixed|Removed)\s*$/.test(section))
    .join('').trim()
  if (!body) throw new Error('Add release notes to CHANGELOG.md before releasing')
  return `${prefix}## Version ${version} - ${date}\n\n${body}\n\n${releases.slice(1).join('')}`
}

if (require.main === module) {
  try {
    const file = path.join(__dirname, '../CHANGELOG.md')
    const { version } = require('../package.json')
    fs.writeFileSync(file, updateChangelog(fs.readFileSync(file, 'utf8'), version, process.argv[2]))
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}

module.exports = { updateChangelog }