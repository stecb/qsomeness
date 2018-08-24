# qsomeness
A zero-dependencies tiny < 5kb tool to work with url querystrings. Works both on server and client. It automatically encode/decode params.

[![Build Status](https://travis-ci.org/stecb/qsomeness.svg?branch=master)](https://travis-ci.org/stecb/qsomeness)

# how to
`npm i qsomeness` and 💥

If you look inside `tests/spec.js`, it should be straightforward understanding how to use it :)
However, there's also an handy api reference.

# API reference

* [URLObject](#urlobject)
* [get](#get)
* [add](#add)
* [addMultiple](#addmultiple)
* [update](#update)
* [updateMultiple](#updatemultiple)
* [remove](#remove)
* [removeMultiple](#removemultiple)
* [removeSingleParam](#removesingleparam)
* [removeMultipleParams](#removemultipleparams)
* [getQuerystringObject](#getquerystringobject)
* [setParam](#setparam)

URLObject
---

This is a quite nice feature as it allows to chain methods (and act as a proxy for static library methods) by setting an instance of URLObject. So it's quite useful if you want to do multiple things on an url w/out creating a string each time, and to keep it on a single instance. Let's see an example:

```js
const { URLObject } = require('qsomeness');

const myUrlObj = new URLObject('http://google.com');

myUrlObj
  .add({ foo: ['bar', 'baz'] })
  .update({ foo: ['baz', 'boz'] })
  // .addMultiple
  // .updateMultiple
  // .remove
  // .removeMultiple
  // .removeSingleParam
  // .removeMultipleParams
  ;

console.log(myUrlObj.getUrl()); // 'http://google.com?foo=baz&foo=boz'
    
console.log(myUrlObj.getQuerystringObject()); // { foo: ['baz', 'boz'] };

```

get
---
```js
const { get } = require('qsomeness');

const paramValue = get('http://google.com?foo=bar', 'foo');
// paramValue => ["bar"]

const multipleParams = get('http://google.com?foo=bar&foo=baz', 'foo');
// multipleParams => ["bar","baz"]

```

add
---
```js
const { add } = require('qsomeness');

const newUrl = add('http://google.com?foo=bar', { q: 'baz' });
// newUrl => "http://google.com?foo=bar&q=baz"

const anotherUrl = add('http://google.com?foo=bar', { foo: 'baz' })
// anotherUrl => "http://google.com?foo=bar&foo=baz"

const thirdUrl = add('http://google.com', { foo: ['bar', 'baz'] });
// thirdUrl => "http://google.com?foo=bar&foo=baz"

```

addMultiple
---
```js
const { addMultiple } = require('qsomeness');

const newUrl = addMultiple('http://google.com', [{ q: 'baz' }, { foo: 'bar' }]);
// newUrl => "http://google.com?q=baz&foo=bar"

```

update
---
```js
const { update } = require('qsomeness');

const newUrl = update('http://google.com?foo=bar', { foo: 'baz' });
// newUrl => "http://google.com?foo=baz"

const anotherUrl = update('http://google.com?foo=bar', { foo: '' }, { removeEmpty: true });
// anotherUrl => "http://google.com"

```

updateMultiple
---
```js
const { updateMultiple } = require('qsomeness');

const newUrl = updateMultiple('http://google.com?foo=bar', [{ foo: 'baz' }, { q: 'bizz' }]);
// newUrl => "http://google.com?foo=baz&q=bizz"

const anotherUrl = updateMultiple('http://google.com?foo=a&bar=b&qux=c', [{ foo: 'baz' }, { bar: null }, { qux: 'bar' }], { removeEmpty: true });
// anotherUrl => "http://google.com?foo=baz&qux=bar

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

removeMultiple
---
```js
const { removeMultiple } = require('qsomeness');

const newUrl = removeMultiple('http://google.com?foo=bar&foo=baz&q=string&key=val', ['foo', 'key']);
// newUrl => "http://google.com?q=string"

```

removeSingleParam
---
```js
const { removeSingleParam } = require('qsomeness');

const newUrl = removeSingleParam('http://google.com?foo=bar&foo=baz', { foo: 'bar' });
// newUrl => "http://google.com?foo=baz"

```

removeMultipleParams
---
```js
const { removeMultipleParams } = require('qsomeness');

const newUrl = removeMultipleParams('http://google.com?foo=bar&foo=baz&q=string', [{ foo: 'bar' }, { q: 'string' }]);
// newUrl => "http://google.com?foo=baz"

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
