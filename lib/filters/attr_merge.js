import Slm from './slm.js';

class AttrMerge extends Slm {
  constructor(mergeAttrs) {
    super();
    this._mergeAttrs = mergeAttrs;
  }

  _merge = function(names, values) {
    const attrs = [];
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const value = values[name];
      const delimiter = this._mergeAttrs[name];
      if (delimiter && value.length > 1) {
        let all = false;
        const exp = ['multi'];
        for (let k = 0; k <  value.length; k++) {
          const kv = value[k];
          all = this._isContainNonEmptyStatic(kv);
          if (!all) {
            break;
          }
        }
        if (all) {
          for (let j = 0; j < value.length; j++) {
            const jv = value[j];
            if (j) {
              exp.push(['static', delimiter]);
            }
            exp.push(jv);
          }
          attrs[i] = ['html', 'attr', name, exp];
        } else {
          const captures = this._uniqueName();
          exp.push(['code', 'var ' + captures + '=[];']);
          for (let a = 0; a < value.length; a++) {
            exp.push(['capture', captures + '[' + a + ']', captures + '[' + a + ']' + '=\'\';', value[a]]);
          }
          exp.push(['dynamic', 'vm.rejectEmpty(' + captures + ').join("' + delimiter + '")']);
          attrs[i] = ['html', 'attr', name, exp];
        }
      } else {
        attrs[i] = ['html', 'attr', name, value[0]];
      }
    }
  
    return ['html', 'attrs'].concat(attrs);
  }

  on_html_attrs = function(exps) {
    // console.log({exps});
    const names = [];
    const values = {};
    for (let i = 2; i < exps.length; i++) {
      const attr = exps[i];
      const name = attr[2].toString();
      const val = attr[3];
      if (values[name]) {
        if (!this._mergeAttrs[name]) {
          throw new Error('Multiple ' + name + ' attributes specified');
        }
  
        values[name].push(val);
      } else {
        values[name] = [val];
        names.push(name);
      }
    }
  
    names.sort();
  
    return this._merge(names, values);
  }
}

export default AttrMerge;
