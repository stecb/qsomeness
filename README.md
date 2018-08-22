# qsomeness
A tiny tool to work with url querystrings. It also automatically encode/decode params for you.

[![Build Status](https://travis-ci.org/stecb/qsomeness.svg?branch=master)](https://travis-ci.org/stecb/qsomeness)

# how to
If you look inside `tests/spec.js`, it should be straightforward understanding how to use it :)
However, there's also an handy api reference.

# API reference

[add](#add)
[get](#get)
[update](#update)
[remove](#remove)
[getQuerystringObject](#getQuerystringObject)
[setParam](#setParam)

add
---
```js
const { add } = require('../index.js');

const newUrl = add('http://google.com?foo=bar', { key: 'q', val: 'baz' });
// newUrl => "http://google.com?foo=bar&q=baz"

const anotherUrl = add('http://google.com?foo=bar', { key: 'foo', val: 'baz' })
// anotherUrl => "http://google.com?foo=bar&foo=baz"

const thirdUrl = add('http://google.com', { key: 'foo', val: ['bar', 'baz'] });
// thirdUrl => "http://google.com?foo=bar&foo=baz"

```

get
---
```js
const { get } = require('../index.js');

const paramValue = get('http://google.com?foo=bar', 'foo');
// paramValue => "bar"

const multipleParams = get('http://google.com?foo=bar&foo=baz', 'foo');
// multipleParams => ['bar','baz']

```

update
---
```js
const { update } = require('../index.js');

const newUrl = update('http://google.com?foo=bar', { key: 'foo', val: 'baz' });
// newUrl => "http://google.com?foo=baz"

```


remove
---
```js
const { remove } = require('../index.js');

const newUrl = remove('http://google.com?foo=bar', 'foo');
// newUrl => "http://google.com"

const anotherUrl = remove('http://google.com?foo=bar&q=baz', 'foo');
// newUrl => "http://google.com?q=baz"

```

getQuerystringObject
---
```js
const { getQuerystringObject } = require('../index.js');

const qsParamsObject = getQuerystringObject('http://google.com?foo=bar&foo=baz&q=fizz');
// qsParamsObject => { foo: ['bar', 'baz'], q: 'fizz' }

```

setParam
---
```js
const { setParam } = require('../index.js');

const myParam = setParam('foo', 'bar');
// myParam => "foo=bar"

const myArrayParam = setParam('foo', ['bar', 'baz']);
// myArrayParam => "foo=bar&foo=baz"
```