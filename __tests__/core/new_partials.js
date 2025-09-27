import { expect } from 'jsr:@std/expect';
import { beforeEach, describe, test } from 'jsr:@std/testing/bdd'
import Template from '../../lib/template.js';
import VM from '../../lib/vm.js';
import { assertHtml } from '../helper.js';

describe('New partials', function() {

  beforeEach(function() {
  });

  test('1. test constructor partials', function() {
    const layout = [
      'html',
      '  head',
      '    = content("head")',
      '  body',
      '    = content("body")'
    ].join('\n');

    const partial = [
      '- if this.what',
      '  strong The partial is ${this.what}',
    ].join('\n');

    const options = {
      partials: {
        layout,
        partial
      }
    }
    const template = new Template(VM, options);

    const src = [
      '- extend("layout")',
      '= content("head")',
      '  meta name="keywords" content=this.who',
      '= content("body")',
      '  p',
      "    ' Hello, ${this.who}",
      '    = partial("partial", {what: this.what})'
    ].join('\n');

    const result = template.render(src, {who: 'World', what: 'the best'}, {});
    expect(result).toEqual('<html><head><meta content="World" name="keywords" /></head><body><p>Hello, World <strong>The partial is the best</strong></p></body></html>');
  });

  test('2. test current context in constructor partials by default', function() {
    const a = 'p Partial ${this.who}'
    const options = {
      partials: {
        a
      }
    }

    const template = new Template(VM, options);

    const src = [
      'p Current ${this.who}',
      '= partial("a")',
      '- this.who = "Another"',
      'p Current ${this.who}',
      '= partial("a")',
    ].join('\n');

    const result = template.render(src, {who: 'World', what: 'the best'}, {});
    expect(result).toEqual('<p>Current World</p><p>Partial World</p><p>Current Another</p><p>Partial Another</p>');
  });

  test('3. test function call partials', function() {
    const layout = [
      'html',
      '  head',
      '    = content("head")',
      '  body',
      '    = content("body")'
    ].join('\n');

    const partial = [
      '- if this.what',
      '  strong The partial is ${this.what}',
    ].join('\n');

    const options = {
      partials: {
        layout,
        partial
      }
    }
    const template = new Template(VM);

    const src = [
      '- extend("layout")',
      '= content("head")',
      '  meta name="keywords" content=this.who',
      '= content("body")',
      '  p',
      "    ' Hello, ${this.who}",
      '    = partial("partial", {what: this.what})'
    ].join('\n');

    const result = template.render(src, {who: 'World', what: 'the best'}, options);
    expect(result).toEqual('<html><head><meta content="World" name="keywords" /></head><body><p>Hello, World <strong>The partial is the best</strong></p></body></html>');
  });

  test('4. test current context in function call partials by default', function() {
    const a = 'p Partial ${this.who}'
    const options = {
      partials: {
        a
      }
    }

    const template = new Template(VM);

    const src = [
      'p Current ${this.who}',
      '= partial("a")',
      '- this.who = "Another"',
      'p Current ${this.who}',
      '= partial("a")',
    ].join('\n');

    const result = template.render(src, {who: 'World', what: 'the best'}, options);
    expect(result).toEqual('<p>Current World</p><p>Partial World</p><p>Current Another</p><p>Partial Another</p>');
  });
});
