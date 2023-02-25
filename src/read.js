const fs = require('fs')

const CHANGELOG_NAMES = ['CHANGELOG.md', 'CHANGELOG', 'changelog.md', 'changelog']

const readChangelog = path => {
  if (path) {
    if (!fs.existsSync(path)) throw new Error('The provided changelog file path does not exist: ' + path)
    else return fs.readFileSync(path, 'utf8')
  }

  const changelog = CHANGELOG_NAMES.find(file => fs.existsSync(file))
  if (!changelog) throw new Error('A changelog could not be found in the following locations: ' + CHANGELOG_NAMES.join(', '))
  return fs.readFileSync(changelog, 'utf8')
}

module.exports = { readChangelog }