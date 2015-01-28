# <a href="http://lighter.io/jymin" style="font-size:40px;text-decoration:none;color:#000"><img src="https://cdn.rawgit.com/lighterio/lighter.io/master/public/jymin.svg" style="width:90px;height:90px"> Jymin</a>
[![NPM Version](https://img.shields.io/npm/v/jymin.svg)](https://npmjs.org/package/jymin)
[![Downloads](https://img.shields.io/npm/dm/jymin.svg)](https://npmjs.org/package/jymin)
[![Build Status](https://img.shields.io/travis/lighterio/jymin.svg)](https://travis-ci.org/lighterio/jymin)
[![Code Coverage](https://img.shields.io/coveralls/lighterio/jymin/master.svg)](https://coveralls.io/r/lighterio/jymin)
[![Dependencies](https://img.shields.io/david/lighterio/jymin.svg)](https://david-dm.org/lighterio/jymin)
[![Support](https://img.shields.io/gittip/zerious.png)](https://www.gittip.com/lighterio/)


Jymin is "JavaScript You Minify", meaning Jymin scripts can be concatenated
with your application code and minfied together. Functions you use will
remain intact, and functions you don't use will minify out. The end result
is that browsers will download and run your code quickly, enabling the fastest
experiences possible.

# Understanding Latency

Browser experiences are affected by three main causes of latency, which can
roughly be categorized as **hops**, **size** and **speed**.
* **Hops** to servers and back can be very latent, depending on distance to
  servers and number of subsequent hops.
* **Size** of downloads affect bandwidth usage, and large assets can cause
  long delays.
* **Speed** of browser rendering is affected by how fast a CPU is and how much
  work it needs to do.

The relationship between
[Moore's Law](http://www.nngroup.com/articles/law-of-bandwidth/) and
[Nielsen's Law](http://en.wikipedia.org/wiki/Moore%27s_law) means CPU speeds
can be expected to increase at a greater rate than bandwidth, so over time,
size becomes more important than speed. Additionally, caching is a
common solution for mitigating latency from hops, and small sizes are better
for caching, both on CDNs (saving cost) and browsers (saving space).



<!--
doNothing
responseSuccessFn
responseFailureFn
getXhr
getUpload
getResponse
forEach
each
getLength
getFirst
getLast
hasMany
push
pop
merge
padArray
getAllCookies
getCookie
setCookie
deleteCookie
getTime
getIsoDate
formatLongDate
formatShortDate
getElement
getElementsByTagName
getElementsByTagAndClass
getParent
createTag
createElement
addElement
appendElement
prependElement
wrapElement
getChildren
getIndex
insertElement
removeElement
clearElement
getHtml
setHtml
getText
setText
getAttribute
setAttribute
getData
setData
getClass
getClasses
setClass
getFirstChild
getPreviousSibling
getNextSibling
hasClass
addClass
removeClass
flipClass
toggleClass
insertScript
all
one
Emitter
EmitterPrototype
CLICK
MOUSEDOWN
MOUSEUP
KEYDOWN
KEYUP
KEYPRESS
bind
on
trigger
stopPropagation
preventDefault
bindFocusChange
bindHover
onHover
bindClick
bindWindowLoad
isLoaded
focusElement
doOnce
addTimeout
removeTimeout
getType
getValue
setValue
getHistory
historyPush
historyReplace
historyPop
onHistoryPop
reservedWordPattern
stringify
parse
execute
parseBoolean
parseNumber
parseString
parseObject
parseArray
error
warn
info
log
trace
ifConsole
ensureNumber
zeroFill
forIn
forOf
decorateObject
ensureProperty
getStorage
fetch
store
ensureString
contains
startsWith
trim
splitByCommas
splitBySpaces
decorateString
match
extractLetters
extractNumbers
lower
upper
escape
unescape
buildQueryString
getBrowserVersionOrZero
isType
isUndefined
isBoolean
isNumber
isString
isFunction
isObject
isInstance
isArray
isDate
getHost
getBaseUrl
getQueryParams
getHashParams
onReady
-->

## Acknowledgements

We would like to thank all of the amazing people who use, support,
promote, enhance, document, patch, and submit comments & issues.
Jymin couldn't exist without you.

Additionally, huge thanks go to [TUNE](http://www.tune.com) for employing
and supporting [Jymin](http://lighter.io/jymin) project maintainers,
and for being an epically awesome place to work (and play).


## MIT License

Copyright (c) 2014 Sam Eubank

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


## How to Contribute

We welcome contributions from the community and are happy to have them.
Please follow this guide when logging issues or making code changes.

### Logging Issues

All issues should be created using the
[new issue form](https://github.com/lighterio/jymin/issues/new).
Please describe the issue including steps to reproduce. Also, make sure
to indicate the version that has the issue.

### Changing Code

Code changes are welcome and encouraged! Please follow our process:

1. Fork the repository on GitHub.
2. Fix the issue ensuring that your code follows the
   [style guide](http://lighter.io/style-guide).
3. Add tests for your new code, ensuring that you have 100% code coverage.
   (If necessary, we can help you reach 100% prior to merging.)
   * Run `npm test` to run tests quickly, without testing coverage.
   * Run `npm run cover` to test coverage and generate a report.
   * Run `npm run report` to open the coverage report you generated.
4. [Pull requests](http://help.github.com/send-pull-requests/) should be made
   to the [master branch](https://github.com/lighterio/jymin/tree/master).

### Contributor Code of Conduct

As contributors and maintainers of Jymin, we pledge to respect all
people who contribute through reporting issues, posting feature requests,
updating documentation, submitting pull requests or patches, and other
activities.

If any participant in this project has issues or takes exception with a
contribution, they are obligated to provide constructive feedback and never
resort to personal attacks, trolling, public or private harassment, insults, or
other unprofessional conduct.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, edits, issues, and other contributions
that are not aligned with this Code of Conduct. Project maintainers who do
not follow the Code of Conduct may be removed from the project team.

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by opening an issue or contacting one or more of the project
maintainers.

We promise to extend courtesy and respect to everyone involved in this project
regardless of gender, gender identity, sexual orientation, ability or
disability, ethnicity, religion, age, location, native language, or level of
experience.
