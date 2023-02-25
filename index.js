const core = require('@actions/core')

const { readChangelog } = require('./src/read')
const { parseReleases, stripVersionString } = require('./src/parse')
const { getLatestRelease, getReleaseForVersion } = require('./src/release')

try {
  const path = core.getInput('path')
  if (path) {
    core.debug('Using changelog file path input: ' + path)
  } else {
    core.debug('Changelog file path input not set. Trying default locations.')
  }

  const changelog = readChangelog(path)
  core.debug('Read changelog contents:\n' + changelog)

  const titleRegex = core.getInput('title-regex')
  core.debug('Using titleRegex input: ' + titleRegex)
  const releases = parseReleases(changelog, titleRegex)
  core.debug('Parsed releases:\n' + JSON.stringify(releases))

  const version = core.getInput('version')
  const release = (() => {
    if (version) {
      core.debug('Using version input: ' + version)
      const strippedVersion = stripVersionString(version)
      core.debug('Using stripped version: ' + strippedVersion)
      return getReleaseForVersion(releases, strippedVersion)
    } else {
      core.debug('Version input not set. Using latest release')
      return getLatestRelease(releases)
    }
  })()

  core.setOutput('title', release.title)
  core.setOutput('body', release.body)
} catch (error) {
  core.setFailed(error.message);
}