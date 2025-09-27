import { expect } from 'jsr:@std/expect';
import { beforeEach, describe, test } from 'jsr:@std/testing/bdd'
import Template from '../../lib/template.js';
import VM from '../../lib/vm.js';

describe('Inheritence', function() {

  let template;

  beforeEach(function() {
    template = new Template(VM);
  });

  test('1. test context', function() {
    const VM = template.VM;
    const vm = new VM();
    vm.resetCache();

    const compileOptions = {
      basePath: '/',
      filename: 'layout'
    };

    vm.cache(compileOptions.filename, template.exec([
      'html',
      '  head',
      '    = content("head")',
      '  body',
      '    = content("body")'
    ].join('\n'), compileOptions, vm));

    compileOptions.filename = 'partial';
    vm.cache(compileOptions.filename, template.exec([
      '- if this.what',
      '  strong The partial is ${this.what}',
    ].join('\n'), compileOptions, vm));


    compileOptions.filename = '/script';

    const src = [
      '- extend("layout")',
      '= content("head")',
      '  meta name="keywords" content=this.who',
      '= content("body")',
      '  p',
      "    ' Hello, ${this.who}",
      '    = partial("partial", {what: this.what})'
    ].join('\n');


    const result = template.render(src, {who: 'World', what: 'the best'}, compileOptions, vm);
    expect(result).toEqual('<html><head><meta content="World" name="keywords" /></head><body><p>Hello, World <strong>The partial is the best</strong></p></body></html>');
  });

  test('2. test default content', function() {
    const VM = template.VM;
    const vm = new VM();
    vm.resetCache();

    const compileOptions = {
      basePath: '/',
      filename: 'layout'
    };

    vm.cache(compileOptions.filename, template.exec([
      'html',
      '  head',
      '    = content("head")',
      '  body',
      '    = content("body")',
      '    footer',
      '      = content("footer")',
      '        p Default footer contents'
    ].join('\n'), compileOptions, vm));

    compileOptions.filename = '/script';

    const src = [
      '- extend("layout")',
      '= content("head")',
      '  meta name="keywords" content=this.what',
      '= content("body")',
      '  p Body content',
    ].join('\n');


    const result = template.render(src, { what: 'hwæt' }, compileOptions, vm);
    expect(result).toEqual('<html><head><meta content="hwæt" name="keywords" /></head><body><p>Body content</p><footer><p>Default footer contents</p></footer></body></html>');
  });

  test('3. test default content replacement', function() {
    const VM = template.VM;
    const vm = new VM();
    vm.resetCache();

    const compileOptions = {
      basePath: '/',
      filename: 'layout'
    };

    vm.cache(compileOptions.filename, template.exec([
      'html',
      '  head',
      '    = content("head")',
      '  body',
      '    = content("body")',
      '    footer',
      '      = content("footer")',
      '        p Default footer contents'
    ].join('\n'), compileOptions, vm));

    compileOptions.filename = '/script';

    const src = [
      '- extend("layout")',
      '= content("head")',
      '  meta name="keywords" content=this.what',
      '= content("body")',
      '  p Body content',
      '= content("footer")',
      '  p Replaced footer content',
    ].join('\n');


    const result = template.render(src, { what: 'hwæt' }, compileOptions, vm);
    expect(result).toEqual('<html><head><meta content="hwæt" name="keywords" /></head><body><p>Body content</p><footer><p>Replaced footer content</p></footer></body></html>');
  });

  test('4. test content replacement with multiple definitions', function() {
    const VM = template.VM;
    const vm = new VM();
    vm.resetCache();

    const compileOptions = {
      basePath: '/',
      filename: 'layout'
    };

    vm.cache(compileOptions.filename, template.exec([
      'html',
      '  head',
      '    = content("head")',
      '  body',
      '    = content("body")',
      '    footer',
      '      = content("footer")',
      '        p Default footer contents'
    ].join('\n'), compileOptions, vm));

    compileOptions.filename = '/script';

    const src = [
      '- extend("layout")',
      '= content("head")',
      '  meta name="keywords" content=this.what',
      '= content("body")',
      '  p Body content',
      '= content("footer")',
      '  p Replaced footer content',
      '= content("footer")',
      '  p Second replaced footer content',
    ].join('\n');


    const result = template.render(src, { what: 'hwæt' }, compileOptions, vm);
    expect(result).toEqual('<html><head><meta content="hwæt" name="keywords" /></head><body><p>Body content</p><footer><p>Replaced footer content</p></footer></body></html>');
  });

});