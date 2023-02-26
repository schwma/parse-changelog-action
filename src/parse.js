const parseReleases = (changelog, titleRegex) => {
  const matches = Array.from(changelog.matchAll(titleRegex))
  const titles = matches.map(m => m[0])
  const indices = matches.map(m => m.index)
  const releases = []
  for (let i = 0; i < indices.length; i++) {
    releases.push(changelog.substring(indices[i], indices[i + 1]).trim())
  }
  let bodies = []
  for (let i = 0; i < releases.length; i++) {
    bodies.push(releases[i].replace(titles[i], '').trim())
  }
  return titles.map((title, i) => ({ title, body: bodies[i]}))
}

const matchVersionString = (version, versionRegex) => {
  const match = version.match(versionRegex)
  if (!match) throw new Error('Could not find match for regex '+ versionRegex + ' in version: ' + version)
  return match[0]
}

module.exports = { parseReleases, matchVersionString }