import { expect } from 'jsr:@std/expect';
import { beforeEach, describe, test } from 'jsr:@std/testing/bdd'
import Template from '../../lib/template.js';
import VM from '../../lib/vm.js';

describe('Interpolate', function() {

  let template;
  beforeEach(function() {
    template = new Template(VM);
  });

  test('1. interpolation in attribute', function() {
    const src = 'p id="a${this.idHelper}b" = this.helloWorld';

    expect(
      template.render(src, {idHelper: 'someid', helloWorld: 'hello world'})
    ).toEqual(
      '<p id="asomeidb">hello world</p>'
    );
  });

  test('2. interpolation in attribute', function() {
    const src = 'p id="a${this.idHelper}b" = this.helloWorld';

    expect(
      template.render(src, {idHelper: 'someid', helloWorld: 'hello world'})
    ).toEqual(
      '<p id="asomeidb">hello world</p>'
    );
  });

  // Not yet
  test('3. nested interpolation in attribute', function() {
    const src = 'p id="${"abc${1+1}" + "("}" = this.helloWorld';

    expect(
      template.render(src, {helloWorld: 'Hello World from @env'})
    ).toEqual(
      '<p id="abc${1+1}(">Hello World from @env</p>'
    );

  });

  test('4. Text interpolation: Expected closing }', function() {
    const src = 'p ${abc';

    expect(function(){ template.render(src, {}); }).toThrow('Text interpolation: Expected closing }');

  });

  test('5. interpolation in text', function() {
    const src =
      'p\n' +
      '  . ${this.helloWorld} with "quotes"\n' +
      'p\n' +
      '  .\n' +
      '    A message from the compiler: ${this.helloWorld}\n';

    expect(
      template.render(src, {helloWorld: 'Hello World from @env'})
    ).toEqual(
      '<p>Hello World from @env with \"quotes\" </p><p>A message from the compiler: Hello World from @env </p>');
  });

  test('6. interpolation in tag', function() {
    const src = 'p ${this.helloWorld}';
    expect(
      template.render(src, {helloWorld: 'Hello'})
    ).toEqual(
      '<p>Hello</p>');
  });

  test('7. escape interpolation', function() {
    const src =
      'p \\${this.helloWorld}\n' +
      'p text1 \\${this.helloWorld} text2';
    expect(
      template.render(src, {helloWorld: 'Hello'})
    ).toEqual(
      '<p>${this.helloWorld}</p><p>text1 ${this.helloWorld} text2</p>');
  });

  test('8. interpolation with escaping', function() {
    const src = '. ${this.evilMethod()}';
    expect(
      template.render(src, {evilMethod: function() {return '<script>do_something_evil();</script>';}})
    ).toEqual(
      '&lt;script&gt;do_something_evil();&lt;/script&gt; ');
  });

  test('9. interpolation without escaping', function() {
    const src = '| ${= this.evilMethod()}';
    expect(
      template.render(src, {evilMethod: function() {return '<script>do_something_evil();</script>';}})
    ).toEqual('<script>do_something_evil();</script>');
  });

  test('10. interpolation with escaping and delimiter', function() {
    const src = '| ${(this.evilMethod())}';
    expect(
      template.render(src, {evilMethod: function() {return '<script>do_something_evil();</script>';}})
    ).toEqual(
      '&lt;script&gt;do_something_evil();&lt;/script&gt;');
  });
});
