const MockBrowser = require('mock-browser').mocks.MockBrowser;
const expect = require('chai').expect;

const qSomeness = require('../index.js');

describe('Remove duplication', () => {
  it('correctly removes duplication from querystring params', () => {
    expect(qSomeness.removeDuplication('http://google.com?foo=bar&foo=bar')).to.equal('http://google.com?foo=bar');
  });
});

describe('Set Param', () => {
  it('correctly returns a querystring param, given key and value', () => {
    expect(qSomeness.setParam('foo', 'bar')).to.equal('foo=bar');
  });
  it('correctly returns a querystring param, given key and value as array', () => {
    expect(qSomeness.setParam('foo', ['bar', 'baz'])).to.equal('foo=bar&foo=baz');
  });
  it('correctly returns a querystring param, encoded', () => {
    expect(qSomeness.setParam('foo', 'bar baz')).to.equal('foo=bar%20baz');
  });
});

describe('Get', () => {
  it('correctly gets an url parameter value', () => {
    expect(qSomeness.get('http://google.com?foo=bar', 'foo')).to.deep.equal(['bar']);
  });
  it('correctly gets multiple url parameter values', () => {
    expect(qSomeness.get('http://google.com?foo=bar&foo=bar2', 'foo')).to.deep.equal(['bar', 'bar2']);
  });
  it('correctly handles no params', () => {
    expect(qSomeness.get('http://google.com?foo=bar', 'bar')).to.equal('');
  });
  it('correctly return decoded param', () => {
    expect(qSomeness.get('http://google.com?foo=bar%20baz', 'foo')).to.deep.equal(['bar baz']);
  });
});

describe('Add', () => {
  it('correctly adds a querystring key/val item', () => {
    expect(qSomeness.add('http://google.com', { foo: 'bar' })).to.equal('http://google.com?foo=bar');
  });
  it('correctly adds a querystring key/val item to an url with an existing querystring', () => {
    expect(qSomeness.add('http://google.com?foo=bar', { foo: 'bar2' })).to.equal('http://google.com?foo=bar&foo=bar2');
  });
  it('correctly adds a querystring key/val item with value as an array', () => {
    expect(qSomeness.add('http://google.com', { foo: ['bar', 'bar2'] })).to.equal('http://google.com?foo=bar&foo=bar2');
  });
  it('correctly adds a querystring key/val item with value as an array to an existing querystring', () => {
    expect(qSomeness.add('http://google.com?foo=bar', { foo: ['bar2', 'baz'] })).to.equal('http://google.com?foo=bar&foo=bar2&foo=baz');
  });
  it('correctly handles duplication by removing it', () => {
    expect(qSomeness.add('http://google.com?foo=bar', { foo: ['bar', 'baz'] })).to.equal('http://google.com?foo=bar&foo=baz');
  });
});

describe('Add multiple', () => {
  it('correctly adds a querystring key/val array of items', () => {
    expect(qSomeness.addMultiple('http://google.com', [{ foo: 'bar' }, { q: 'baz' }])).to.equal('http://google.com?foo=bar&q=baz');
  });
  it('correctly adds a querystring key/val array of items to existing querystring', () => {
    expect(qSomeness.addMultiple('http://google.com?q=bar', [{ foo: 'bar' }, { q: 'baz' }])).to.equal('http://google.com?q=bar&foo=bar&q=baz');
  });
});

describe('Update', () => {
  it('correctly adds a querystring param if no param was on the querystring', () => {
    expect(qSomeness.update('http://google.com', { foo: 'bar' })).to.equal('http://google.com?foo=bar');
  });
  it('correctly updates a querystring param', () => {
    expect(qSomeness.update('http://google.com?foo=bar', { foo: 'baz' })).to.equal('http://google.com?foo=baz');
  });
  it('correctly updates a querystring param via setting an array of params', () => {
    expect(qSomeness.update('http://google.com?foo=bar', { foo: ['baz', 'boz'] })).to.equal('http://google.com?foo=baz&foo=boz');
  });
  it('correctly updates a querystring param with an undefined value', () => {
    expect(qSomeness.update('http://google.com?foo=bar', { foo: undefined })).to.equal('http://google.com?foo=undefined');
  });
  it('correctly updates a querystring param with a 0 value', () => {
    expect(qSomeness.update('http://google.com?foo=bar', { foo: 0 })).to.equal('http://google.com?foo=0');
  });
  it('correctly updates a querystring param with a empty string value', () => {
    expect(qSomeness.update('http://google.com?foo=bar', { foo: '' })).to.equal('http://google.com?foo=');
  });
  it('correctly updates a querystring param with option removeEmpty and undefined value', () => {
    expect(qSomeness.update('http://google.com?foo=bar', { foo: undefined }, { removeEmpty: true })).to.equal('http://google.com');
  });
  it('correctly updates a querystring param with option removeEmpty and empty string value', () => {
    expect(qSomeness.update('http://google.com?foo=bar', { foo: '' }, { removeEmpty: true })).to.equal('http://google.com');
  });
  it('correctly updates a querystring param with option removeEmpty and empty string value', () => {
    expect(qSomeness.update('http://google.com?foo=bar', { foo: null }, { removeEmpty: true })).to.equal('http://google.com');
  })
});

describe('Update multiple', () => {
  it('correctly updates multiple querystring params', () => {
    expect(qSomeness.updateMultiple('http://google.com?foo=bar&q=baz', [{ foo: 'baz' }, { q: 'bizz' }])).to.equal('http://google.com?foo=baz&q=bizz');
  });
  it('correctly adds multiple querystring params if noone is present on the url', () => {
    expect(qSomeness.updateMultiple('http://google.com', [{ foo: 'baz' }, { q: 'bizz' }])).to.equal('http://google.com?foo=baz&q=bizz');
  });
  it('correctly updates and adds', () => {
    expect(qSomeness.updateMultiple('http://google.com?foo=bar', [{ foo: 'baz' }, { q: 'bizz' }])).to.equal('http://google.com?foo=baz&q=bizz');
  });
  it('correctly updates multiple querystring params for undefined values', () => {
    expect(qSomeness.updateMultiple('http://google.com?foo=bar&q=baz', [{ foo: undefined }, { q: undefined }])).to.equal('http://google.com?foo=undefined&q=undefined');
  });
  it('correctly updates multiple querystring params with option removeEmpty', () => {
    expect(qSomeness.updateMultiple('http://google.com?foo=bar&q=baz&bar=baz', [{ foo: 'a' }, { q: undefined }, { bar: 'bazz' }], { removeEmpty: true })).to.equal('http://google.com?foo=a&bar=bazz');
  });
  it('correctly updates all querystring params with option removeEmpty', () => {
    expect(qSomeness.updateMultiple('http://google.com?foo=bar&q=baz&bar=baz', [{ foo: '' }, { q: '' }, { bar: undefined }], { removeEmpty: true })).to.equal('http://google.com');
  });
});

describe('Remove', () => {
  it('correctly removes a querystring param', () => {
    expect(qSomeness.remove('http://google.com?foo=bar', 'foo')).to.equal('http://google.com');
  });
  it('correctly removes a querystring param if multiple', () => {
    expect(qSomeness.remove('http://google.com?foo=bar&foo=baz', 'foo')).to.equal('http://google.com');
  });
  it('correctly returns the url if no qs params match the provided key', () => {
    expect(qSomeness.remove('http://google.com?bar=foo', 'foo')).to.equal('http://google.com?bar=foo');
  });
});

describe('Remove multiple', () => {
  it('correctly removes multiple params', () => {
    expect(qSomeness.removeMultiple('http://google.com?foo=bar&foo=baz', ['foo', 'baz'])).to.equal('http://google.com');
  });
  it('correctly removes multiple params keeping other params', () => {
    expect(qSomeness.removeMultiple('http://google.com?foo=bar&foo=baz&q=string&key=val', ['foo', 'key'])).to.equal('http://google.com?q=string');
  });
});

describe('Remove single full param', () => {
  it('correctly removes a querystring full key/value param', () => {
    expect(qSomeness.removeSingleParam('http://google.com?foo=bar&foo=baz', { foo: 'bar' })).to.equal('http://google.com?foo=baz');
  });
});

describe('Remove multiple full param', () => {
  it('correctly removes multiple querystring full key/value params', () => {
    expect(qSomeness.removeMultipleParams('http://google.com?foo=bar&foo=baz&q=string', [{ foo: 'bar' }, { q: 'string' }])).to.equal('http://google.com?foo=baz');
  });
});

describe('Get querystring', () => {
  it('correctly gets querystring as object', () => {
    expect(qSomeness.getQuerystringObject('http://google.com?foo=bar')).to.deep.equal({ foo: 'bar' });
  });
  it('correctly gets querystring as object if multiple params as array', () => {
    expect(qSomeness.getQuerystringObject('http://google.com?foo=bar&foo=baz')).to.deep.equal({ foo: ['bar', 'baz'] });
  });
  it('correctly returns empty object if no querystring', () => {
    expect(qSomeness.getQuerystringObject('http://google.com')).to.deep.equal({});
  });
  it('correctly returns an object with encoded values', () => {
    expect(qSomeness.getQuerystringObject('http://google.com?foo=bar%20baz')).to.deep.equal({ foo: 'bar baz'});
  });
});

describe('URLObject', () => {
  it('instantiate a new URLObject', () => {
    const url = new qSomeness.URLObject('http://google.com');
    expect(url instanceof qSomeness.URLObject).to.be.true;
  });
  it('should throw if not used new', () => {
    try {
      const url = qSomeness.URLObject('http://google.com');
    } catch (error) {
      expect(error.message).to.equal('You should use the new keyword!');
    }
  });
  it('should return the current url when in the browser', () => {
    process.browser = true;
    const window = global.window;
    global.window = new MockBrowser().getWindow();
    const url = new qSomeness.URLObject();
    expect(url instanceof qSomeness.URLObject).to.be.true;
    expect(url.url).to.equal('about:blank');
    global.window = window;
    process.browser = false;
  });
  it('should throw if url is empty and is not in browser', () => {
    expect(() => new qSomeness.URLObject()).to.throw(Error, 'url parameter is mandatory');
  });
  it('chain methods', () => {
    const url = new qSomeness.URLObject('http://google.com');
    url
      .add({ foo: ['bar', 'baz'] })
      .update({ foo: ['baz', 'boz'] });
    expect(url.getUrl()).to.equal('http://google.com?foo=baz&foo=boz');
    expect(url.getQuerystringObject()).to.deep.equal({ foo: ['baz', 'boz']});
  });
});
