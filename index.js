const qSomeness = {
  removeDuplication: (url) => {
    const [urlPart, qs] = url.split('?');
    return typeof qs !== 'undefined' ?
      `${urlPart}?${qs.split('&').filter((val, i, self) => self.indexOf(val) === i).join('&')}` :
      urlPart;
  },
  getParam: (key, val) => !Array.isArray(val) ?
    `${encodeURIComponent(key)}=${encodeURIComponent(val)}` :
    val.map((v) => qSomeness.getParam(key, v)).join('&'),
  add: (url, { key, val }) => {
    const check = url.split('?').length > 1;
    return check ?
      `${url}&${qSomeness.getParam(key, val)}` :
      `${url}?${qSomeness.getParam(key, val)}`;
  },
  update: (url, { key, val }) => {
    const check = url.split('?').length > 1;
    if (check) {
      let found = false;
      const [urlPart, qs] = url.split('?');
      const editedQs = qs.split('&').map((qsEl) => {
        if (qsEl.split('=')[0] === key) {
          found = true;
          return qSomeness.getParam(key, val);
        }
        return qsEl;
      });
      const newQs = found ? editedQs : [...editedQs, qSomeness.getParam(key, val)];
      return `${urlPart}?${newQs.join('&')}`;
    }
    return `${url}?${qSomeness.getParam(key, val)}`;
  },
  remove: (url, key) => {
    const check = url.split('?').length > 1;
    if (check) {
      const [urlPart, qs] = url.split('?');
      const newQs = qs.split('&').filter((qsEl) => qsEl.split('=')[0] !== key);
      return `${urlPart}?${newQs.join('&')}`;
    }
    return /\?$/.test(url) ? url.substring(0, url.length - 1) : url;
  },
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
      foundParams[0].split('=')[1] :
      foundParams.map((p) => p.split('=')[1]);
  },
};

const toRemoveDuplication = ['add', 'update', 'remove'];

module.exports = Object.keys(qSomeness).reduce((obj, method) => {
  obj[method] = toRemoveDuplication.indexOf(method) > -1 ?
    (...args) => qSomeness.removeDuplication(qSomeness[method].apply(qSomeness, args)) :
    qSomeness[method];
  return obj;
}, {});
