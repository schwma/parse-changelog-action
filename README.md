# Parse changelog action

This GitHub action parses a specific release from a CHANGELOG that roughly follows the "Keep a Changelog" format.

## Inputs

### `path`

**Optional** The path of the changelog file to parse. By default the following file names will be attempted: `CHANGELOG.md`, `CHANGELOG`, `changelog.md`, `changelog`. Default `undefined`.

### `title-regex`

**Optional** The regex to use when finding release titles. Default `"^## .*$"`.

### `version`

**Optional** The release version to parse from the changelog (all non-digit and period characters will be stipped away). The latest release will be used if this value isn't supplied. Default `undefined`.

## Outputs

### `title`

The title of the parsed release.

### `body`

The body of the parsed release.

## Example usage

```yaml
- name: Parse changelog
  uses: schwma/parse-changelog-action@v0.1.0
  id: parse-changelog
  with:
    version: 'v1.2.3'
- name: Print parsed release title and body
  run: |
    echo 'Release title:'
    echo '${{ steps.parse-changelog.outputs.title }}'
    echo 'Release body:'
    echo '${{ steps.parse-changelog.outputs.body }}'

```