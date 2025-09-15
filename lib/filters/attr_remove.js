import Slm from './slm.js';

class AttrRemove extends Slm {
  constructor(removeEmptyAttrs) {
    super();
    this._removeEmptyAttrs = removeEmptyAttrs;
  }
  
  on_html_attr = function (exps) {
    const name = exps[2];
    const value = exps[3];
    if (this._removeEmptyAttrs[name.toString()] === undefined) {
      return Slm.prototype.on_html_attr.call(this, exps);
    }

    if (this._isContainNonEmptyStatic(value)) {
      return ['html', 'attr', name, value];
    }

    const tmp = this._uniqueName();
    return [
      'multi',
      ['capture', tmp, 'var ' + tmp + '=\'\';', this.compile(value)],
      ['if', tmp + '.length',
        ['html', 'attr', name, ['dynamic', tmp]]
      ]
    ];
  }
}

export default AttrRemove;
