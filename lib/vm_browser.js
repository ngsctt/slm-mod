import VM from './vm.js';

class VMBrowser extends VM {
  constructor () {
    super();
  }

  runInContext = function (src, filename) {
    if (filename) {
      src += '\n//# sourceURL=' + filename;
    }
    return eval(src);
  };

  _resolvePath = function () { };
}

export default VMBrowser;
