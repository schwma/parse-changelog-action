# Parse changelog action

This GitHub action parses a specific release from a CHANGELOG that roughly follows the "Keep a Changelog" format.

## Inputs

### `path`

**Optional** The path of the changelog file to parse. By default the following file names will be attempted: `CHANGELOG.md`, `CHANGELOG`, `changelog.md`, `changelog`. Default `undefined`.

### `title-regex`

**Optional** The regex to use when finding release titles. Default `"^## .*$"`.

### `version-regex`

**Optional** The regex to use when matching the version string from the version input and release titles. These regex matches are then used for comparison. Default `\d+\.\d+\.\d+`.

### `version`

**Optional** The release version to parse from the changelog (the `version-regex` input will be used to create a regex match from this input). The latest release will be used if this value isn't supplied. Default `undefined`.

## Outputs

### `title`

The title of the parsed release.

### `body`

The body of the parsed release.

## Example usage

```yaml
- name: Parse changelog
  uses: schwma/parse-changelog-action@latest
  id: parse-changelog
  with:
    version: '${{ github.ref_name }}' # tag name on tag push events
- name: Print parsed release title and body
  run: |
    echo 'Release title:'
    echo '${{ steps.parse-changelog.outputs.title }}'
    echo 'Release body:'
    echo '${{ steps.parse-changelog.outputs.body }}'
```

## Releasing

On `main`, set the version in `package.json` and record the changelog entries in its matching `tbd` section in `CHANGELOG.md`. Review all pending changes, then run:

```sh
npm run release
npm install
npm test
npm run build
git add .
git commit -m "chore: prepare release 1.3.0"
git push origin main
git tag v1.3.0
git push origin v1.3.0
```

`npm run release` only dates the changelog entry and removes empty sections. The commands above use `1.3.0` as an example; substitute your release version. Verify the release workflow succeeds: it creates the GitHub release from the changelog and updates the major-version and `latest` tags. Nothing is published to npm or GitHub Marketplace.

After the workflow succeeds, bump the version in `package.json`, then run:

```sh
git fetch origin --tags --force
npm run post-release
npm install
npm run build
git add .
git commit -m "Prepare next release"
```

`npm run post-release` only adds the next `tbd` changelog section with empty Added, Changed, Fixed, and Removed headings. The forced fetch refreshes moved local tags such as `v1` and `latest`; `npm install` updates the lockfile. Push the preparation commit when ready.