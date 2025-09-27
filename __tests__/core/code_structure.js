import { expect } from 'jsr:@std/expect';
import { beforeEach, describe, test } from 'jsr:@std/testing/bdd'
import Template from '../../lib/template.js';
import VM from '../../lib/vm.js';
import { assertHtml } from '../helper.js';

describe('Code structure', function() {
  let template;

  beforeEach(function() { template = new Template(VM); });

  test('1. render with conditional', function() {
    assertHtml(template, [
      'div',
      '  - if this.showFirst()',
      '      p The first paragraph',
      '  - else',
      '      p The second paragraph'
      ],
      '<div><p>The second paragraph</p></div>',
      {});
  });

  test('2. render with conditional else if', function() {
    assertHtml(template, [
      'div',
      '  - if this.showFirst()',
      '      p The first paragraph',
      '  - else if this.showFirst(true)',
      '      p The second paragraph',
      '  - else',
      '      p The third paragraph'
      ],
      '<div><p>The second paragraph</p></div>',
      {});
  });

  test('3. render with consecutive conditionals', function() {
    assertHtml(template, [
      'div',
      '  - if this.showFirst(true)',
      '      p The first paragraph',
      '  - if this.showFirst(true)',
      '      p The second paragraph'
      ],
      '<div><p>The first paragraph</p><p>The second paragraph</p></div>',
      {});
  });

  test('4. render with when string in condition', function() {
    assertHtml(template, [
      '- if true',
      '  | Hello',

      '- if "when" !== null',
      '  |  world'
      ],
      'Hello world',
      {});
  });

  test('5. render with conditional and following nonconditonal', function() {
    assertHtml(template, [
      'div',
      '  - if true',
      '      p The first paragraph',
      '  - var x = 42',
      '  = x'
      ],
      '<div><p>The first paragraph</p>42</div>',
      {});
  });

  test('6. render with case', function() {
    assertHtml(template, [
      'p',
      '  - switch(42)',
      '    - case 41:',
      '      | 41',
      '      - break',
      '    - case 42:',
      '      | 42',
      '      - break',
      '  |  is the answer',
      'p',
      '  - switch(41)',
      '    - case 41:',
      '      | 41',
      '      - break',
      '    - case 42:',
      '      | 42',
      '      - break',
      '  |  is the answer',
      'p',
      '  - switch(42)',
      '    - case 41:',
      '      | 41',
      '      - break',
      '    - case 42:',
      '      | 42',
      '      - break',
      '  |  is the answer',
      'p',
      '  - switch(41)',
      '    - case 41:',
      '      | 41',
      '      - break',
      '    - case 42:',
      '      | 42',
      '      - break',
      '  |  is the answer'
      ],
      '<p>42 is the answer</p><p>41 is the answer</p><p>42 is the answer</p><p>41 is the answer</p>',
      {});
  });

  test('7. render with slm comments', function() {
    assertHtml(template, [
      'p Hello',
      '/ This is a comment',
      '  Another comment',
      'p World'
      ],
      '<p>Hello</p><p>World</p>',
      {});
  });

  test('8. render with slm comments and empty line', function() {
    assertHtml(template, [
      'p Hello',
      '/ This is a comment',
      '',
      '  Another comment',
      'p World'
      ],
      '<p>Hello</p><p>World</p>',
      {});
  });

  test('9. render with try catch', function() {
    assertHtml(template, [
      '- try',
      '  p Try',
      '- catch error',
      '  p Catch',
      'p After'
      ],
      '<p>Try</p><p>After</p>',
      {});
  });

  test('10. render with try catch exception', function() {
    assertHtml(template, [
      '- try',
      '  p Try',
      '  - throw "Boom"',
      '  p After Boom',
      '- catch ex',
      '  p = ex',
      'p After'
      ],
      '<p>Try</p><p>Boom</p><p>After</p>',
      {});
  });

  test('11. render with try catch finally', function() {
    assertHtml(template, [
      '- try',
      '  p Try',
      '  - throw "Boom"',
      '  p After Boom',
      '- catch ex',
      '  p = ex',
      '- finally',
      '  p Finally',
      'p After'
      ],
      '<p>Try</p><p>Boom</p><p>Finally</p><p>After</p>',
      {});
  });

  test('12. injects callback arg', function() {
    assertHtml(template, [
      '= this.block()',
      '  p Block',
      'p After'
      ],
      '<p>Block</p><p>After</p>',
      {});
  });

  test('13. detects missing brace', function() {
    let src = [
      '= this.block)',
      '  p Block',
      'p After'
      ].join('\n');
    expect(function() {
      template.render(src, {}, {});
    }).toThrow('Missing open brace \"(\" in `this.block)`');
  });

  test('14. simple mixin', function() {
    assertHtml(template, [
      '= mixin("say", "a", "b")',
      '  p Hello ${this.a} by ${this.b}',
      '.hello',
      '  = mixin("say", "Slm", "mixin")'
      ],
      '<div class="hello"><p>Hello Slm by mixin</p></div>',
      {});
  });

  test('15. mixin with loop', function() {
    assertHtml(template, [
      '= mixin("say", "list")',
      '  ul',
      '    - this.list.forEach(function(item))',
      '      li = item.name',
      '.hello',
      '  = mixin("say", [{ name: "a" }, { name: "b" }])'
      ],
      '<div class="hello"><ul><li>a</li><li>b</li></ul></div>',
      {});
  });

  test('16. second simple mixin', function() {
    // Previously 'mixin with content'
    assertHtml(template, [
      '= mixin("say", "listOfItems")',
      '  p Hello from mixin!',
      '  ul',
      '    - this.listOfItems.forEach(function(item))',
      '      li = item.name',
      '.hello',
      '  = mixin("say", [{ name: "a" }, { name: "b" }])',
      '  p ${this.items}'
      ],
      '<div class="hello"><p>Hello from mixin!</p><ul><li>a</li><li>b</li></ul><p>1,2,3</p></div>',
      {});
  });

  test('17. mixin with all defaults values', function() {
    assertHtml(template, [
      '= mixin("say", "a = Slm", "b = mixin")',
      '  p Hello ${this.a} by ${this.b}',
      '.hello',
      '  = mixin("say")'
      ],
      '<div class="hello"><p>Hello Slm by mixin</p></div>',
      {});
  });


  test('18. mixin with first default value', function() {
    assertHtml(template, [
      '= mixin("say", "a = Slm", "b")',
      '  p Hello ${this.a} by ${this.b}',
      '.hello',
      '  = mixin("say", "Mom")'
      ],
      '<div class="hello"></div>',
      {});
  });

  test('19. mixin with second default value', function() {
    assertHtml(template, [
      '= mixin("say", "a", "b= mixin")',
      '  p Hello ${this.a} by ${this.b}',
      '.hello',
      '  = mixin("say", "Mom")'
      ],
      '<div class="hello"><p>Hello Mom by mixin</p></div>',
      {});
  });

  test('20. mixin with contexts', function() {
    const VM = template.VM;
    const vm = new VM();
    vm.resetCache();

    const compileOptions = {
      basePath: '/',
      filename: 'mixins.slm'
    };

    vm.cache(compileOptions.filename, template.exec([
      '= mixin("say", "a", "b")',
      '  p Hello ${this.a} by ${this.b}'
    ].join('\n'), compileOptions, vm));

    const src = [
      '= partial("mixins.slm")',
      '.hello',
      '  = mixin("say", "Slm", "mixin")'
    ].join('\n');

    const result = template.render(src, {}, compileOptions, vm);
    expect(result).toEqual('<div class="hello"><p>Hello Slm by mixin</p></div>');
  });

  test('21. render with forEach', function() {
    assertHtml(template, [
      'div',
      '  - this.items.forEach(function(i))',
      '    p = i',
      ],
      '<div><p>1</p><p>2</p><p>3</p></div>',
      {});
  });

  test('22. render with for', function() {
    assertHtml(template, [
      'ul',
      '  - for let item in this.items',
      '    li = item'
    ],
    '<ul><li>0</li><li>1</li><li>2</li></ul>',
    {});
  });

  test('23. render with multiline attributes', function() {
    assertHtml(template, [
      'div class="test\\',
      '    nice"'
      ],
      '<div class="test nice"></div>',
      {});

    assertHtml(template, [
      'div class=[1,',
      '  2].join("")'
      ],
      '<div class="12"></div>',
      {});
  });

  test('24. render with multiline attributes', function() {
    assertHtml(template, [
      'div class=(1 + \\',
      '  2)'
      ],
      '<div class="3"></div>',
      {});

    assertHtml(template, [
      'div class=[1,',
      '  2].join("")'
      ],
      '<div class="12"></div>',
      {});
  });
});
