const getKV = (param) => {
  const key = Object.keys(param)[0];
  const val = param[key];
  return { key, val };
};
const isEmpty = val => val === '' || typeof val === 'undefined';

const qSomeness = {
  removeDuplication: (url) => {
    const [urlPart, qs] = url.split('?');
    return typeof qs !== 'undefined' ?
      `${urlPart}?${qs.split('&').filter((val, i, self) => self.indexOf(val) === i).join('&')}` :
      urlPart;
  },

  setParam: (key, val) => !Array.isArray(val) ?
    `${encodeURIComponent(key)}=${encodeURIComponent(val)}` :
    val.map((v) => qSomeness.setParam(key, v)).join('&'),

  add: (url, param) => {
    const check = url.split('?').length > 1;
    const { key, val } = getKV(param);
    const newParam = qSomeness.setParam(key, val);
    return check ?
      `${url}&${newParam}` :
      `${url}?${newParam}`;
  },

  addMultiple: (url, params) => {
    const check = url.split('?').length > 1;
    const newParams = params.map((param) => {
      const { key, val } = getKV(param);
      return qSomeness.setParam(key, val);
    }).join('&');
    return check ?
      `${url}&${newParams}` :
      `${url}?${newParams}`;
  },

  update: (url, param, options = {}) => {
    const [urlPart, qs] = url.split('?');
    const { key, val } = getKV(param);
    if(options.removeEmpty && isEmpty(val))
      return qSomeness.remove(url, key);
    if (typeof qs !== 'undefined') {
      let found = false;
      const editedQs = qs.split('&').map((qsEl) => {
        if (qsEl.split('=')[0] === key) {
          found = true;
          return qSomeness.setParam(key, val);
        }
        return qsEl;
      });
      const newQs = found ? editedQs : [...editedQs, qSomeness.setParam(key, val)];
      return `${urlPart}?${newQs.join('&')}`;
    }
    return `${url}?${qSomeness.setParam(key, val)}`;
  },

  updateMultiple: (url, params, options = {}) => params.reduce((newUrl, currParam) => qSomeness.update(newUrl, currParam, options), url),

  remove: (url, key) => {
    const [urlPart, qs] = url.split('?');
    if (typeof qs !== 'undefined') {
      const newQs = qs.split('&').filter((qsEl) => qsEl.split('=')[0] !== key);
      return newQs.length === 0 ? urlPart : `${urlPart}?${newQs.join('&')}`;
    }
    return url;
  },

  removeMultiple: (url, keys) => keys.reduce((newUrl, key) => qSomeness.remove(newUrl, key), url),

  removeSingleParam: (url, param) => {
    const [urlPart, qs] = url.split('?');
    if (typeof qs !== 'undefined') {
      const newQs = qs.split('&').filter((qsEl) => {
        const [key, val] = qsEl.split('=');
        const { key: paramKey, val: paramVal } = getKV(param);
        return `${key}${val}` !== `${paramKey}${paramVal}`;
      });
      return newQs.length === 0 ? urlPart : `${urlPart}?${newQs.join('&')}`;
    }
    return url;
  },

  removeMultipleParams: (url, params) => params.reduce((newUrl, param) => qSomeness.removeSingleParam(newUrl, param), url),

  get: (url, key) => {
    const [, qs] = url.split('?');
    if (typeof qs === 'undefined') {
      return '';
    }
    const foundParams = qs.split('&').filter((qsEl) => qsEl.split('=')[0] === key);
    if (foundParams.length === 0) {
      return '';
    }
    return foundParams.length === 1 ?
      [decodeURIComponent(foundParams[0].split('=')[1])] :
      foundParams.map((p) => decodeURIComponent(p.split('=')[1]));
  },

  getQuerystringObject: (url) => {
    const [, qs] = url.split('?');
    if (typeof qs === 'undefined') {
      return {};
    }
    return qs.split('&').reduce((obj, param) => {
        const [key, val] = param.split('=');
        if (Array.isArray(obj[key])) {
          obj[key] = [...obj[key], decodeURIComponent(val)];
        } else {
          obj[key] = obj[key] ? [obj[key], decodeURIComponent(val)] : decodeURIComponent(val);
        }
        return obj;
      }, {});
  }
};

const CHAINABLE = [
  'removeDuplication', 'add', 'addMultiple',
  'update', 'updateMultiple', 'remove',
  'removeMultiple', 'removeSingleParam', 'removeMultipleParams'
];

const ENHANCED_METHODS = Object.assign({}, qSomeness, {
  add: (...args) => qSomeness.removeDuplication(qSomeness.add(...args)),
  addMultiple: (...args) => qSomeness.removeDuplication(qSomeness.addMultiple(...args)),
  update: (...args) => qSomeness.removeDuplication(qSomeness.update(...args)),
  updateMultiple: (...args) => qSomeness.removeDuplication(qSomeness.updateMultiple(...args)),
  remove: (...args) => qSomeness.removeDuplication(qSomeness.remove(...args)),
  removeMultiple: (...args) => qSomeness.removeDuplication(qSomeness.removeMultiple(...args)),
  removeSingleParam: (...args) => qSomeness.removeDuplication(qSomeness.removeSingleParam(...args)),
  removeMultipleParams: (...args) => qSomeness.removeDuplication(qSomeness.removeMultipleParams(...args)),
});

function URLObject(url) {
  if (!(this instanceof URLObject)) {
    throw new Error('You should use the new keyword!');
  }
  this.url = url;
}

Object.keys(ENHANCED_METHODS).forEach((method) => {
  URLObject.prototype[method] = function (...args) {
    const isChainable = CHAINABLE.indexOf(method) > -1;
    if (isChainable) {
      this.url = ENHANCED_METHODS[method](this.url, ...args);
      return this;
    }
    return ENHANCED_METHODS[method](this.url, ...args);
  }
});

URLObject.prototype.getUrl = function() {
  return this.url;
}

module.exports = Object.assign({}, ENHANCED_METHODS, { URLObject });
