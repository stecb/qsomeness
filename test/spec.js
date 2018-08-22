const expect = require('chai').expect;

const qSomeness = require('../index.js');

describe('Remove duplication', () => {
  it('correctly removes duplication from querystring params', () => {
    expect(qSomeness.removeDuplication('http://google.com?foo=bar&foo=bar')).to.equal('http://google.com?foo=bar');
  });
});

describe('Get Param', () => {
  it('correctly returns a querystring param, given key and value', () => {
    expect(qSomeness.getParam('foo', 'bar')).to.equal('foo=bar');
  });
  it('correctly returns a querystring param, given key and value as array', () => {
    expect(qSomeness.getParam('foo', ['bar', 'baz'])).to.equal('foo=bar&foo=baz');
  });
});

describe('Get', () => {
  it('correctly gets an url parameter value', () => {
    expect(qSomeness.get('http://google.com?foo=bar', 'foo')).to.equal('bar');
  });
  it('correctly gets multiple url parameter values', () => {
    expect(qSomeness.get('http://google.com?foo=bar&foo=bar2', 'foo')).to.deep.equal(['bar', 'bar2']);
  });
  it('correctly handles no params', () => {
    expect(qSomeness.get('http://google.com?foo=bar', 'bar')).to.equal('');
  });
});

describe('Add', () => {
  it('correctly adds a querystring key/val item', () => {
    expect(qSomeness.add('http://google.com', { key: 'foo', val: 'bar' })).to.equal('http://google.com?foo=bar');
  });
  it('correctly adds a querystring key/val item to an url with an existing querystring', () => {
    expect(qSomeness.add('http://google.com?foo=bar', { key: 'foo', val: 'bar2' })).to.equal('http://google.com?foo=bar&foo=bar2');
  });
  it('correctly adds a querystring key/val item with value as an array', () => {
    expect(qSomeness.add('http://google.com', { key: 'foo', val: ['bar', 'bar2'] })).to.equal('http://google.com?foo=bar&foo=bar2');
  });
  it('correctly adds a querystring key/val item with value as an array to an existing querystring', () => {
    expect(qSomeness.add('http://google.com?foo=bar', { key: 'foo', val: ['bar2', 'baz'] })).to.equal('http://google.com?foo=bar&foo=bar2&foo=baz');
  });
  it('correctly handles duplication by removing it', () => {
    expect(qSomeness.add('http://google.com?foo=bar', { key: 'foo', val: ['bar', 'baz'] })).to.equal('http://google.com?foo=bar&foo=baz');
  });
});

describe('Update', () => {
  it('correctly adds a querystring param if no param was on the querystring', () => {
    expect(qSomeness.update('http://google.com', { key: 'foo', val: 'bar' })).to.equal('http://google.com?foo=bar');
  });
  it('correctly updates a querystring param', () => {
    expect(qSomeness.update('http://google.com?foo=bar', { key: 'foo', val: 'baz' })).to.equal('http://google.com?foo=baz');
  });
  it('correctly updates a querystring param via setting an array of params', () => {
    expect(qSomeness.update('http://google.com?foo=bar', { key: 'foo', val: ['baz', 'boz'] })).to.equal('http://google.com?foo=baz&foo=boz');
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
