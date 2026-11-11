const trimLines = text => text.split('\n').map(line => line.trim()).join('\n').trim()

module.exports = { trimLines }