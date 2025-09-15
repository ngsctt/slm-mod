import Filter from '../filter.js';

/**
* Merges several statics into a single static.  Example:
*
*   ['multi',
*     ['static', 'Hello '],
*     ['static', 'World!']]
*
* Compiles to:
*
*   ['static', 'Hello World!']
*/

class StaticMerger extends Filter {
  constructor () {
    super();
  }

  on_multi = function (exps) {
    const res = ['multi'];
    let node;

    for (let i = 1; i < exps.length; i++) {
      const exp = exps[i];
      if (exp[0] === 'static') {
        if (node) {
          node[1] += exp[1];
        } else {
          node = ['static', exp[1]];
          res.push(node);
        }
      } else {
        res.push(this.compile(exp));
        if (exp[0] !== 'newline') {
          node = null;
        }
      }
    }

    return res.length === 2 ? res[1] : res;
  };
}

export default StaticMerger;
