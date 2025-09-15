import Filter from '../filter.js';
import VM from '../vm.js';

class Escape extends Filter {
  constructor () {
    super();
    this._disableEscape = false;
    this._escape = false;
    this._escaper = VM.escape;
  }
  
  _escapeCode = function(v) {
    return 'vm.escape(' + v.replace(/;+$/, '') + ')';
  }
  
  on_escape = function(exps) {
    const old = this.escape;
    this._escape = exps[1] && !this._disableEscape;
    try {
      return this.compile(exps[2]);
    } finally {
      this._escape = old;
    }
  }
  
  on_static = function(exps) {
    return ['static', this._escape ? this._escaper(exps[1]) : exps[1]];
  }
  
  on_dynamic = function(exps) {
    return ['dynamic', this._escape ? this._escapeCode(exps[1]) : exps[1]];
  }
}

export default Escape;
