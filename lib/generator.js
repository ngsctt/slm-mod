import Dispatcher from './dispatcher.js';

class Generator extends Dispatcher {
  constructor () {
    super();
    this._buffer = '_b';
  }

  exec = function (exp) {
    return [this.preamble(), this.compile(exp)].join('');
  };

  on = function (exp) {
    throw new Error('Generator supports only core expressions - found ' + JSON.stringify(exp));
  };

  on_multi = function (exps) {
    for (let i = 1; i < exps.length; i++) {
      exps[i] = this.compile(exps[i]);
    }
    exps.shift();
    return exps.join('\n');
  };

  on_newline = function () {
    return '';
  };

  on_static = function (exps) {
    return this.concat(JSON.stringify(exps[1]));
  };

  on_dynamic = function (exps) {
    return this.concat(exps[1]);
  };

  on_code = function (exps) {
    return exps[1];
  };

  concat = function (str) {
    return this._buffer + '+=' + str + ';';
  };
}

export default Generator;
