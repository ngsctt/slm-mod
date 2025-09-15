import Dispatcher from './dispatcher.js';

let uniqueName = 0;

class Filter extends Dispatcher {
  // Tools

  _isEmptyExp = function (exp) {
    switch (exp[0]) {
      case 'multi':
        for (let i = 1; i < exp.length; i++) {
          if (!this._isEmptyExp(exp[i])) {
            return false;
          }
        }
        return true;
      case 'newline':
        return true;
      default:
        return false;
    }
  };

  _uniqueName = function () {
    uniqueName++;
    return '$lm' + uniqueName.toString(16);
  };

  _compileEach = function (exps, startIndex) {
    for (let i = startIndex; i < exps.length; i++) {
      exps[i] = this.compile(exps[i]);
    }
    return exps;
  };

  _shiftAndCompile = function (exps) {
    return this._compileEach(exps, 2);
  };

  // Core

  on_multi = function (exps) {
    return this._compileEach(exps, 1);
  };

  on_capture = function (exps) {
    return ['capture', exps[1], exps[2], this.compile(exps[3])];
  };

  // Control Flow

  on_if = this._shiftAndCompile;

  _shiftAndCompileMulti = function (exps) {
    const res = ['multi'];

    for (let i = 2; i < exps.length; i++) {
      res.push(this.compile(exps[i]));
    }
    return res;
  };

  on_switch = function (exps) {
    for (let i = 2; i < exps.length; i++) {
      const exp = exps[i];
      exps[i] = [exp[0], this.compile(exp[1])];
    }
    return exps;
  };

  on_block = function (exps) {
    return ['block', exps[1], this.compile(exps[2])];
  };

  // Escaping

  on_escape = function (exps) {
    return ['escape', exps[1], this.compile(exps[2])];
  };
}

export default Filter;
