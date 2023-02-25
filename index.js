const core = require('@actions/core')

const { readChangelog } = require('./src/read')
const { parseReleases, stripVersionString } = require('./src/parse')
const { getLatestRelease, getReleaseForVersion } = require('./src/release')

try {
  const changelog = readChangelog()

  const titleRegex = core.getInput('title-regex')
  core.debug('Using titleRegex: ' + titleRegex)
  const releases = parseReleases(changelog, titleRegex)

  const version = core.getInput('version')
  let release
  if (version) {
    core.debug('Using version: ' + version)
    const stippedVersion = stripVersionString(version)
    core.debug('Stripped version:' + stippedVersion)
    release = getReleaseForVersion(releases, version)
  } else {
    core.debug('Version not set. Using latest release')
    release = getLatestRelease(releases)
  }

  core.setOutput('title', release.title)
  core.setOutput('body', release.body)
} catch (error) {
  core.setFailed(error.message);
}