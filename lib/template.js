import AttrMerge from './filters/attr_merge.js';
import AttrRemove from './filters/attr_remove.js';
import Brackets from './filters/brackets.js';
import CodeAttributes from './filters/code_attributes.js';
import ControlFlow from './filters/control_flow.js';
import Controls from './filters/controls.js';
import Embeddeds from './filters/embedded.js';
import Engine from './engine.js';
import Escape from './filters/escape.js';
import FastHtml from './html/fast.js';
import Interpolate from './filters/interpolate.js';
import MultiFlattener from './filters/multi_flattener.js';
import Parser from './parser.js';
import StaticMerger from './filters/static_merger.js';
import StringGenerator from './generators/string.js';

class Template {
  constructor (VM, options) {
    options = options || {};
    options.mergeAttrs = options.mergeAttrs || { 'class': ' ' };
    options.attrDelims = options.attrDelims || { '(': ')', '[': ']' };

    this.VM = VM;
    this._engine = new Engine();
    this.Embeddeds = Embeddeds;

    this._embedded = new Embeddeds.Embedded();

    this.registerEmbedded('script', new Embeddeds.Javascript());
    this.registerEmbedded('javascript', new Embeddeds.Javascript({ typeAttribute: true }));
    this.registerEmbedded('css', new Embeddeds.CSS());

    const filters = this._defaultFilters(options);
    for (let i = 0; i < filters.length; i++) {
      this._engine.use(filters[i]);
    }
  }

  _defaultFilters = function (options) {
    return [
      new Parser(options.attrDelims),
      this._embedded,
      new Interpolate(),
      new Brackets(),
      new Controls(),
      new AttrMerge(options.mergeAttrs),
      new CodeAttributes(options.mergeAttrs),
      new AttrRemove(options.mergeAttrs),
      new FastHtml(options.format),
      new Escape(),
      new ControlFlow(),
      new MultiFlattener(),
      new StaticMerger(),
      new StringGenerator()
    ];
  };

  registerEmbedded = function (name, engine) {
    this._embedded.register(name, engine);
  };

  registerEmbeddedFunction = function (name, renderer) {
    const engine = new this.Embeddeds.InterpolateEngine(renderer);

    this.registerEmbedded(name, engine);
  };

  render = function (src, model, options, vm) {
    vm = vm || new this.VM();
    return this.compile(src, options, vm)(model, vm);
  };

  compile = function (src, options, vm) {
    vm = vm || new this.VM();

    const fn = this.exec(src, options, vm);

    const fnWrap = function (model) {
      const res = fn.call(model, vm);
      vm.reset();
      return res;
    };
    return fnWrap;
  };

  exec = function (src, options, vm) {
    options = options || {};

    if (options.useCache !== undefined && !options.useCache) {
      vm._load = vm._loadWithoutCache;
    }

    vm.template = this;
    vm.basePath = options.basePath;
    vm.filename = options.filename;
    // vm.require  = options.require || module.require;
    vm.rebind();

    return vm.runInContext(this.src(src, options), vm.filename)[0];
  };

  src = function (src, options) {
    return [
      '[function(vm) {',
      'vm.m = this;',
      // 'var sp = vm.stack.length, require = vm.require, content = vm._content, extend = vm._extend, partial = vm._partial, mixin = vm._mixin, j = vm.j;',
      'var sp = vm.stack.length, content = vm._content, extend = vm._extend, partial = vm._partial, mixin = vm._mixin, j = vm.j;',
      this._engine.exec(src, options),
      'vm.res=_b;return vm.pop(sp);}]'
    ].join('');
  };

  exports = function () {
    return {
      Template: Template,
      template: this,
      compile: this.compile.bind(this),
      render: this.render.bind(this)
    };
  };
}

export default Template;
