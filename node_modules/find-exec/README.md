# find-exec

[![Build Status](https://travis-ci.org/shime/find-exec.svg)](https://travis-ci.org/shime/find-exec)

Takes a list of shell commands and returns the first available. Works synchronously to respect the order.

Returns `null` if none of the listed commands were found.

## examples

    $ which mplayer
    which: no mplayer

    $ which afplay
    /usr/bin/afplay

```javascript
var command = require('find-exec')(["mplayer", "afplay", "cvlc"])
console.log(command) // afplay
```

```javascript
var command = require('find-exec')(["mplayer"])
console.log(command) // null
```

## installation

    npm install find-exec

## license

MIT
