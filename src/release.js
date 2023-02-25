const getLatestRelease = releases => releases[0]

const getReleaseForVersion = (releases, version) => releases.find(r => r.title.includes(version))

module.exports = { getLatestRelease, getReleaseForVersion }