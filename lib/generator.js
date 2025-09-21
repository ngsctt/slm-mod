import Dispatcher from './dispatcher.js';

function Generator() {
  this._buffer = '_b';
}

const p = Generator.prototype = new Dispatcher();

p.exec = function(exp) {
  return [this.preamble(), this.compile(exp)].join('');
};

p.on = function(exp) {
  throw new Error('Generator supports only core expressions - found ' + JSON.stringify(exp));
};

p.on_multi = function(exps) {
  for (let i = 1; i < exps.length; i++) {
    exps[i] = this.compile(exps[i]);
  }
  exps.shift();
  return exps.join('\n');
};

p.on_newline = function() {
  return '';
};

p.on_static = function(exps) {
  return this.concat(JSON.stringify(exps[1]));
};

p.on_dynamic = function(exps) {
  return this.concat(exps[1]);
};

p.on_code = function(exps) {
  return exps[1];
};

p.concat = function(str) {
  return this._buffer + '+=' + str + ';';
};

export default Generator;
