import VM from './vm.js';

function VMBrowser() { VM.call(this); }

const p = VMBrowser.prototype = new VM();

p.runInContext = function(src, filename) {
  if (filename) {
    src += '\n//# sourceURL=' + filename;
  }
  return eval(src);
};

p._resolvePath = function() {};

export default VMBrowser;
