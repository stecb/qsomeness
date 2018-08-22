# qsomeness
A zero-dependencies tiny 3kb tool to work with url querystrings. Works both on server and client. It automatically encode/decode params.

[![Build Status](https://travis-ci.org/stecb/qsomeness.svg?branch=master)](https://travis-ci.org/stecb/qsomeness)

# how to
`npm i qsomeness` and 💥

If you look inside `tests/spec.js`, it should be straightforward understanding how to use it :)
However, there's also an handy api reference.

# API reference

* [add](#add)
* [addMultiple](#addmultiple)
* [get](#get)
* [update](#update)
* [updateMultiple](#updatemultiple)
* [remove](#remove)
* [getQuerystringObject](#getquerystringobject)
* [setParam](#setparam)

add
---
```js
const { add } = require('qsomeness');

const newUrl = add('http://google.com?foo=bar', { key: 'q', val: 'baz' });
// newUrl => "http://google.com?foo=bar&q=baz"

const anotherUrl = add('http://google.com?foo=bar', { key: 'foo', val: 'baz' })
// anotherUrl => "http://google.com?foo=bar&foo=baz"

const thirdUrl = add('http://google.com', { key: 'foo', val: ['bar', 'baz'] });
// thirdUrl => "http://google.com?foo=bar&foo=baz"

```

addMultiple
---
```js
const { addMultiple } = require('qsomeness');

const newUrl = addMultiple('http://google.com', [{ key: 'q', val: 'baz' }, { key: 'foo', val: 'bar' }]);
// newUrl => "http://google.com?q=baz&foo=bar"

```

get
---
```js
const { get } = require('qsomeness');

const paramValue = get('http://google.com?foo=bar', 'foo');
// paramValue => "bar"

const multipleParams = get('http://google.com?foo=bar&foo=baz', 'foo');
// multipleParams => ['bar','baz']

```

update
---
```js
const { update } = require('qsomeness');

const newUrl = update('http://google.com?foo=bar', { key: 'foo', val: 'baz' });
// newUrl => "http://google.com?foo=baz"

```

updateMultiple
---
```js
const { updateMultiple } = require('qsomeness');

const newUrl = updateMultiple('http://google.com?foo=bar', [{ key: 'foo', val: 'baz' }, { key: 'q', val: 'bizz' }]);
// newUrl => "http://google.com?foo=baz&q=bizz"

```


remove
---
```js
const { remove } = require('qsomeness');

const newUrl = remove('http://google.com?foo=bar', 'foo');
// newUrl => "http://google.com"

const anotherUrl = remove('http://google.com?foo=bar&q=baz', 'foo');
// newUrl => "http://google.com?q=baz"

```

getQuerystringObject
---
```js
const { getQuerystringObject } = require('qsomeness');

const qsParamsObject = getQuerystringObject('http://google.com?foo=bar&foo=baz&q=fizz');
// qsParamsObject => { foo: ['bar', 'baz'], q: 'fizz' }

```

setParam
---
```js
const { setParam } = require('qsomeness');

const myParam = setParam('foo', 'bar');
// myParam => "foo=bar"

const myArrayParam = setParam('foo', ['bar', 'baz']);
// myArrayParam => "foo=bar&foo=baz"
```

## Contributing

Just make a PR 🍺
