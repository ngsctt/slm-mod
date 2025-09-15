import Generator from '../generator.js';

class StringGenerator extends Generator {
  constructor (name, initializer) {
    super();
    this._buffer = name || '_b';
    this._initializer = initializer;
  }

  preamble = function () {
    return this._initializer ? this._initializer : 'var ' + this._buffer + '=\'\';';
  };

  on_capture = function (exps) {
    const generator = new StringGenerator(exps[1], exps[2]);
    generator._dispatcher = this._dispatcher;
    return generator.exec(exps[3]);
  };
}

export default StringGenerator;
