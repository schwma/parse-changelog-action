const core = require('@actions/core')

const { readChangelog } = require('./src/read')
const { parseReleases, stripVersionString } = require('./src/parse')
const { getLatestRelease, getReleaseForVersion } = require('./src/release')

try {
  const path = core.getInput('path')
  if (path) {
    core.debug('Using changelog file path: ' + path)
  } else {
    core.debug('Changelog file path not set. Trying default locations.')
  }

  const changelog = readChangelog(path)
  core.debug('Read changelog contents:\n' + changelog)

  const titleRegex = core.getInput('title-regex')
  core.debug('Using titleRegex: ' + titleRegex)
  const releases = parseReleases(changelog, titleRegex)

  const version = core.getInput('version')
  const release = (() => {
    if (version) {
      core.debug('Using version: ' + version)
      const stippedVersion = stripVersionString(version)
      core.debug('Stripped version:' + stippedVersion)
      return getReleaseForVersion(releases, version)
    } else {
      core.debug('Version not set. Using latest release')
      return getLatestRelease(releases)
    }
  })()

  core.setOutput('title', release.title)
  core.setOutput('body', release.body)
} catch (error) {
  core.setFailed(error.message);
}