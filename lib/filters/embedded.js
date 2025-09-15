import Slm from './slm.js';

class TextCollector extends Slm {
  constructor () {
    super();
  }
  
  exec = function(exp) {
    this._collected = '';
    Slm.prototype.exec.call(this, exp);
    return this._collected;
  }
  
  on_slm_interpolate = function(exps) {
    this._collected += exps[2];
  }
}

class Engine extends Slm {
  constructor() {
    super();
    this._textCollector = new TextCollector();
  }
  
  collectText = function(body) {
    return this._textCollector.exec(body);
  }
}

class Javascript extends Engine {
  constructor (options) {
    super();
    this._withType = options && options.typeAttribute;
  }

  on_slm_embedded = function(exps) {
    const body = exps[3];
    if (this._withType) {
      return ['html', 'tag', 'script', ['html', 'attrs',
        ['html', 'attr', 'type', ['static', 'text/javascript']]], body];
    }
    return ['html', 'tag', 'script', ['html', 'attrs'], body];
  }
}

class CSS extends Engine {
  constructor () {
    super();
  }

  on_slm_embedded = function (exps) {
    const body = exps[3];
    return ['html', 'tag', 'style', ['html', 'attrs',
      ['html', 'attr', 'type', ['static', 'text/css']]], body];
  }
}

class Embedded extends Slm {
  constructor () {
    super();
    this._engines = {};
  }
  
  register = function(name, filter) {
    this._engines[name] = filter;
  }
  
  on_slm_embedded = function(exps) {
    const name = exps[2];
    const engine = this._engines[name];
    if (!engine) {
      throw new Error('Embedded engine ' + name + ' is not registered.');
    }
    return this._engines[name].on_slm_embedded(exps);
  }
}

class InterpolateEngine extends Engine {
  constructor (renderer) {
    super();
    this.renderer = renderer;
  }
  
  on_slm_embedded = function(exps) {
    const body = exps[3];
    const text = this.collectText(body);
    return ['multi', ['slm', 'interpolate', this.renderer(text)]];
  }
}

export default {
  Embedded,
  Javascript,
  CSS,
  TextCollector,
  InterpolateEngine
};