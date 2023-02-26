const core = require('@actions/core')

const { readChangelog } = require('./src/read')
const { parseReleases, matchVersionString } = require('./src/parse')
const { getLatestRelease, getReleaseForVersion } = require('./src/release')

try {
  const package = require('../package.json')
  core.debug(package.name + '@' + package.version)

  const path = core.getInput('path')
  if (path) {
    core.debug('Using changelog file path input: ' + path)
  } else {
    core.debug('Changelog file path input not set. Trying default locations')
  }

  const changelog = readChangelog(path)
  core.debug('Read changelog contents:\n' + changelog)

  const titleRegex = new RegExp(core.getInput('title-regex'), 'gm')
  core.debug('Using title-regex input: ' + titleRegex)
  const releases = parseReleases(changelog, titleRegex)
  core.debug('Parsed releases:\n' + JSON.stringify(releases))

  const versionRegex = new RegExp(core.getInput('version-regex'))
  core.debug('Using version-regex input: ' + versionRegex)
  const version = core.getInput('version')
  const release = (() => {
    if (version) {
      core.debug('Using version input: ' + version)
      const matchedVersion = matchVersionString(version, versionRegex)
      core.debug('Using version regex match: ' + matchedVersion)
      return getReleaseForVersion(releases, matchedVersion, versionRegex)
    } else {
      core.debug('Version input not set. Using latest release')
      return getLatestRelease(releases)
    }
  })()
  core.debug('Found release:\n' + JSON.stringify(release))

  core.setOutput('title', release.title)
  core.setOutput('body', release.body)
} catch (error) {
  core.setFailed(error.message);
}