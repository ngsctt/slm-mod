class Engine {
  constructor () {
    this._chain = [];
  }

  use = function (filter) {
    this._chain.push(filter);
  };

  exec = function (src, options) {
    let res = src;

    for (let i = 0; i < this._chain.length; i++) {
      res = this._chain[i].exec(res, options);
    }

    return res;
  };
}

export default Engine;
