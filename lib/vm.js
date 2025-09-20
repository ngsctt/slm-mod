const ampRe = /&/g;
const escapeRe = /[&<>"]/;
const gtRe = />/g;
const ltRe = /</g;
const quotRe = /"/g;

class SafeStr {
  constructor (val) {
    this.htmlSafe = true;
    this._val = val;
  }

  toString = function () {
    return this._val;
  };
}


function safe (val) {
  if (!val || val.htmlSafe) {
    return val;
  }

  return new SafeStr(val);
}

function j (val) {
  const str = JSON.stringify(val) + '';
  return str.replace(/<\//g, "<\\/");
}

function escape (str) {
  if (typeof str !== 'string') {
    if (!str) {
      return '';
    }
    if (str.htmlSafe) {
      return str.toString();
    }
    str = str.toString();
  }

  if (escapeRe.test(str)) {
    if (str.indexOf('&') !== -1) {
      str = str.replace(ampRe, '&amp;');
    }
    if (str.indexOf('<') !== -1) {
      str = str.replace(ltRe, '&lt;');
    }
    if (str.indexOf('>') !== -1) {
      str = str.replace(gtRe, '&gt;');
    }
    if (str.indexOf('"') !== -1) {
      str = str.replace(quotRe, '&quot;');
    }
  }

  return str;
}

function rejectEmpty (arr) {
  const res = [];

  for (let i = 0; i < arr.length; i++) {
    const el = arr[i];

    if (el !== null && el.length) {
      res.push(el);
    }
  }

  return res;
}

function flatten (arr) {
  return arr.reduce(function (acc, val) {
    if (val === null) {
      return acc;
    }
    // TODO: investigate why test fails with this line
    // return acc.concat(val.constructor === Array ? flatten(val) : val.toString());
    return acc.concat(Array.isArray(val) ? flatten(val) : val.toString());
  }, []);
}

class VM {
  static _cache = {};
  static escape = escape;
  static safe = safe;

  constructor () {
    this.reset();
    this.template = this.basePath = null;
    this._cache = VM._cache;
  }

  escape = escape;
  safe = safe;
  j = j;
  flatten = flatten;
  rejectEmpty = rejectEmpty;

  resetCache = function () {
    this._cache = VM._cache = {};
  };

  cache = function (name, value) {
    this._cache[name] = value;
  };

  rebind = function () {
    this._content = this.content.bind(this);
    this._extend = this.extend.bind(this);
    this._partial = this.partial.bind(this);
    this._mixin = this.mixin.bind(this);
  };

  _load = function (path) {
    const fn = this._cache[path];
    if (fn) {
      return fn;
    } else {
      console.warn(`Partial "${path}" is missing!`);
      return null;
    }
  };

  /*
    Prepare VM for next template rendering
  */
  reset = function () {
    this._contents = {};
    this._mixins = {};
    this.res = '';
    this.stack = [];
    this.m = null;
  };

  /*
    Pop stack to sp
  */
  pop = function (sp) {
    const currentFilename = this.filename;
    let l = this.stack.length;
    while (sp < l--) {
      this.filename = this.stack.pop();
      this._load(this.filename).call(this.m, this);
    }
    this.filename = currentFilename;
    return this.res;
  };

  extend = function (path) {
    this.stack.push(path);
  };

  partial = function (path, model, cb) {
    const stashedResult = this.res;
    if (cb) {
      this.res = cb.call(this.m, this);
    }

    if (model === undefined) {
      model = this.m;
    }

    const f = this._load(path);
    if (f) {
      const stashedFilename = this.filename;
      const stashedModel = this.m;
      this.filename = path;
      const res = safe(f.call(this.m = model, this));
      this.m = stashedModel;
      this.filename = stashedFilename;
      this.res = stashedResult;
      return res;
    } else return '';
  };

  content = function () {
    let cb, mod, name;
    switch (arguments.length) {
      case 0: // return main content
        return safe(this.res);
      case 1: // return named content
        return safe(this._contents[arguments[0]] || '');
      case 2: // capture named content
        name = arguments[0];
        cb = arguments[1];
        if (name) {
          // capturing block
          this._contents[name] = cb.call(this.m);
          return '';
        }
        return cb.call(this.m);
      case 3: {
        // content operations: default, append, prepend
        name = arguments[0];
        mod = arguments[1];
        cb = arguments[2];
        const contents = this._contents[name] || '';
        switch (mod) {
          case 'default':
            return safe(contents || cb.call(this.m));
          case 'append':
            this._contents[name] = contents + cb.call(this.m);
            return '';
          case 'prepend':
            this._contents[name] = cb.call(this.m) + contents;
            return '';
        }
      }
    }
  };

  mixin = function () {
    const name = arguments[0];

    const lastArgument = arguments[arguments.length - 1];
    if (typeof lastArgument === 'function') { // mixin definition
      const cb = lastArgument;

      // make Mixin parameters from definition
      const args = [];
      for (let i = 1; i < arguments.length - 1; i++) {
        let param = arguments[i];
        let defaultValue = null;

        // check the default value [= mixin("name", "a=1", "b = 2", "c")]
        const m = param.match(/([^\=\s]*)\s*\=\s*(.*)/);
        if (m) {
          param = m[1];
          defaultValue = m[2];
        }

        args.push({
          name: param,
          value: defaultValue
        });
      }

      if (name) {
        this._mixins[name] = {
          arguments: args,
          body: cb
        };
        return '';
      }
      return '';
    }

    // mixin reference
    const referenceParams = [];
    for (let i = 1; i < arguments.length; i++) {
      referenceParams.push(arguments[i]);
    }

    // try to find mixin
    let mixin = null;
    for (const item of Object.keys(this._mixins)) {
      // Check Mixin name
      if (item === name) {
        const maybeMixin = this._mixins[item];

        // check balance of arguments. If Mixin has free parameters without default values then skip this Mixin
        const paramsLength = maybeMixin.arguments.length;
        let mixinStatus = true;
        for (let i = referenceParams.length; i < maybeMixin.arguments.length; i++) {
          const param = maybeMixin.arguments[i];

          if (!param.value) {
            mixinStatus = false;
            break;
          }
        }

        if (mixinStatus) {
          mixin = maybeMixin;
          break;
        }
      }
    }

    if (!mixin) {
      return '';
    }

    // add default values
    const mixinParams = mixin.arguments;
    if (referenceParams.length !== mixinParams.length) {
      for (let i = referenceParams.length; i < mixinParams.length; i++) {
        if (mixinParams[i]) {
          referenceParams.push(mixinParams[i].value);
        }
      }
    }

    // convert Array to Object
    const params = {};
    for (let i = 0; i < referenceParams.length; i++) {
      params[mixinParams[i].name] = referenceParams[i];
    }

    // merge Mixin params with context
    if (this.m) {
      for (const item of Object.keys(this.m)) {
        params[item] = this.m[item];
      }
    }

    return mixin.body.call(params);
  };

  runInContext = function (src) {
    return eval(src);
  };
}

export default VM;
