import { beforeEach, describe, test } from 'jsr:@std/testing/bdd'
import Template from '../../lib/template.js';
import VM from '../../lib/vm.js';
import { assertHtml } from '../helper.js';

describe('Text interpolation', function() {
  let template;
  beforeEach(function() {
    template = new Template(VM);
  });

  test('1. interpolation in attribute', function() {
    assertHtml(template, [
      'p id="a${this.idHelper}b" = this.helloWorld'
      ],
      '<p id="anoticeb">Hello World from @env</p>',
      {});
  });

  test('2. nested interpolation in attribute', function() {
    assertHtml(template, [
      'p id="${"abc${1+1}" + "("}" = this.helloWorld'
      ],
      '<p id="abc${1+1}(">Hello World from @env</p>',
      {});
  });

  test('3. expression in interpolation', function() {
    assertHtml(template, [
      'p ${this.helloWorld2 || "test"} other text',
      ],
      '<p>test other text</p>',
      {});
  });

  test('4. interpolation in text', function() {
    assertHtml(template, [
      'p',
      ' | ${this.helloWorld} with "quotes"',
      'p',
      ' |',
      '  A message from the compiler: ${this.helloWorld}'
      ],
      '<p>Hello World from @env with "quotes"</p><p>A message from the compiler: Hello World from @env</p>',
      {});
  });

  test('5. interpolation in tag', function() {
    assertHtml(template, [
      'p ${this.helloWorld}'
      ],
      '<p>Hello World from @env</p>',
      {});
  });

  test('6. escape interpolation', function() {
    assertHtml(template, [
      'p \\${this.helloWorld}',
      'p text1 \\${this.helloWorld} text2'
      ],
      '<p>${this.helloWorld}</p><p>text1 ${this.helloWorld} text2</p>',
      {});
  });

  test('7. interpolation with escaping', function() {
    assertHtml(template, [
      '| ${this.evilMethod()}'
      ],
      '&lt;script&gt;do_something_evil();&lt;/script&gt;',
      {});
  });

  test('8. interpolation with escaping', function() {
    assertHtml(template, [
      '| ${=this.evilMethod()}'
      ],
      '<script>do_something_evil();</script>',
      {});
  });

  test('9. interpolation with escaping and delimiter', function() {
    assertHtml(template, [
      '| ${(this.evilMethod())}'
      ],
      '&lt;script&gt;do_something_evil();&lt;/script&gt;',
      {});
  });
});
