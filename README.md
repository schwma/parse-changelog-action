# Parse changelog action

This GitHub action parses a specific release from a CHANGELOG that roughly follows the "Keep a Changelog" format.

## Inputs

### `path`

**Optional** The path of the changelog file to parse. By default the following file names will be attempted: `CHANGELOG.md`, `CHANGELOG`, `changelog.md`, `changelog`. Default `undefined`.

### `title-regex`

**Optional** The regex to use when finding release titles. Default `"^## .*$"`.

### `version-regex`

**Optional** The regex to use when matching the version string from the version input and release titles. These regex matches are then used for comparison. Default `\\d+\\.\\d+\\.\\d+`.

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