const getLatestRelease = releases => releases[0]

const getReleaseForVersion = (releases, version, versionRegex) => releases.find(r => r.title.match(versionRegex)[0] === version)

module.exports = { getLatestRelease, getReleaseForVersion }