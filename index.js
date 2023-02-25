const core = require('@actions/core')

const { parseReleases, getReleaseForVersion } = require('./src/parse')
const { readChangelog } = require('./src/read')

try {
  const changelog = readChangelog()

  const titleRegex = core.getInput('title-regex')
  core.debug('Using titleRegex: ' + titleRegex)
  const releases = parseReleases(changelog, titleRegex)

  const version = core.getInput('version')
  core.debug('Using version: ' + version)
  const release = version ? getReleaseForVersion(releases, version) : releases[0]

  core.setOutput('title', release.title)
  core.setOutput('body', release.body)
} catch (error) {
  core.setFailed(error.message);
}