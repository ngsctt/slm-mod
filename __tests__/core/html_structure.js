import { expect } from 'jsr:@std/expect';
import { beforeEach, describe, test } from 'jsr:@std/testing/bdd'
import Template from '../../lib/template.js';
import VM from '../../lib/vm.js';
import { assertHtml } from '../helper.js';

describe('Html structure', function() {

  let template;

  beforeEach(function() {
    template = new Template(VM);
  });

  test('1. simple render', function() {
    assertHtml(template, [
      'html',
      '  head',
      '    title Simple Test Title',
      '  body ',
      '    p Hello World, meet Slim.'
    ],
    '<html><head><title>Simple Test Title</title></head><body><p>Hello World, meet Slim.</p></body></html>',
    {});
  });

  test('2. relaxed indentation of first line', function() {
    assertHtml(template, [
      '  p',
      '    .content'
    ],
    '<p><div class=\"content\"></div></p>',
    {});
  });

  test('3. html tag with text and empty line', function() {
    assertHtml(template, [
      'p Hello',
      '',
      'p World'
    ],
    '<p>Hello</p><p>World</p>',
    {});
  });

  test('4. html namespaces', function() {
    assertHtml(template, [
      'html:body',
      '  html:p html:id="test" Text'
    ],
    '<html:body><html:p html:id="test">Text</html:p></html:body>',
    {});
  });

  test('5. doctype', function() {
    assertHtml(template, [
      'doctype 1.1',
      'html'
    ],
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"><html></html>',
    {});
  });

  test('6. render with shortcut attributes', function() {
    assertHtml(template, [
      'h1#title This is my title',
      '#notice.hello.world',
      '  = this.helloWorld'
    ],
    '<h1 id="title">This is my title</h1><div class="hello world" id="notice">Hello World from @env</div>',
    {});
  });

  test('7. render with text block', function() {
    assertHtml(template, [
      'p',
      '  |',
      '   Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    ],
    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>',
    {});
  });

  test('8. render with text block with subsequent markup', function() {
    assertHtml(template, [
      'p',
      '  |',
      '    Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'p Some more markup'
    ],
    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Some more markup</p>',
    {});
  });

  test('9. render with text block with subsequent markup', function() {
    assertHtml(template, [
      'p',
      '  |',
      '    Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'p Some more markup'
    ],
    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Some more markup</p>',
    {});
  });

  test('10. render with text block with trailing whitespace', function() {
    assertHtml(template, [
      '. this is',
      '  a link to',
      'a href="link" page'
    ],
    'this is\na link to <a href="link">page</a>',
    {});
  });

  test('11. render with text block with trailing whitespace', function() {
    assertHtml(template, [
      'p',
      ' |',
      '  This is line one.',
      '   This is line two.',
      '    This is line three.',
      '     This is line four.',
      'p This is a new paragraph.'
    ],
    '<p>This is line one.\n This is line two.\n  This is line three.\n   This is line four.</p><p>This is a new paragraph.</p>',
    {});
  });

  test('12. nested text with nested html one same line', function() {
    assertHtml(template, [
      'p',
      ' | This is line one.',
      '    This is line two.',
      ' span.bold This is a bold line in the paragraph.',
      ' |  This is more content.'
    ],
    '<p>This is line one.\n This is line two.<span class="bold">This is a bold line in the paragraph.</span> This is more content.</p>',
    {});
  });

  test('13. nested text with nested html one same line 2', function() {
    assertHtml(template, [
      'p',
      ' |This is line one.',
      '   This is line two.',
      ' span.bold This is a bold line in the paragraph.',
      ' |  This is more content.'
    ],
    '<p>This is line one.\n This is line two.<span class="bold">This is a bold line in the paragraph.</span> This is more content.</p>',
    {});
  });

  test('14. nested text with nested html', function() {
    assertHtml(template, [
      'p',
      ' |',
      '  This is line one.',
      '   This is line two.',
      '    This is line three.',
      '     This is line four.',
      ' span.bold This is a bold line in the paragraph.',
      ' |  This is more content.'
    ],
    '<p>This is line one.\n This is line two.\n  This is line three.\n   This is line four.<span class="bold">This is a bold line in the paragraph.</span> This is more content.</p>',
    {});
  });

  test('15. simple paragraph with padding', function() {
    assertHtml(template, [
      'p    There will be 3 spaces in front of this line.'
    ],
    '<p>   There will be 3 spaces in front of this line.</p>',
    {});
  });

  test('16. paragraph with nested text', function() {
    assertHtml(template, [
      'p This is line one.',
      '   This is line two.'
    ],
    '<p>This is line one.\n This is line two.</p>',
    {});
  });

  test('17. paragraph with padded nested text', function() {
    assertHtml(template, [
      'p  This is line one.',
      '   This is line two.'
    ],
    '<p> This is line one.\n This is line two.</p>',
    {});
  });

  test('18. labels with with br', function() {
    assertHtml(template, [
      'label',
      '  . Название',
      '  input name="name" type="text" value=1',
      'br',
      '',
      'label',
      '  . Название 2',
      '  input name="name" type="text" value=2'
    ],
    '<label>Название <input name="name" type="text" value="1" /></label><br /><label>Название 2 <input name="name" type="text" value="2" /></label>',
    {});
  });

  test('19. with inline mustashe', function() {
    assertHtml(template, [
      'label {{title}}'
    ],
    '<label>{{title}}</label>',
    {});
  });

  test('20. paragraph with attributes and nested text', function() {
    assertHtml(template, [
      'p#test class="paragraph" This is line one.',
      '                         This is line two.'
    ],
    '<p class="paragraph" id="test">This is line one.\nThis is line two.</p>',
    {});
  });

  test('21. output code with leading spaces', function() {
    assertHtml(template, [
      'p= this.helloWorld',
      'p = this.helloWorld',
      'p    = this.helloWorld'
    ],
    '<p>Hello World from @env</p><p>Hello World from @env</p><p>Hello World from @env</p>',
    {});
  });

  test('22. output code with leading spaces 2', function() {
    assertHtml(template, [
      'p =< this.helloWorld'
    ],
    ' <p>Hello World from @env</p>',
    {});

    assertHtml(template, [
      'p<= this.helloWorld'
    ],
    ' <p>Hello World from @env</p>',
    {});
  });

  test('23. single quoted attributes', function() {
    assertHtml(template, [
      'p class=\'underscored_class_name\' = this.outputNumber'
    ],
    '<p class="underscored_class_name">1337</p>',
    {});
  });

  test('24. nonstandard shortcut attributes', function() {
    assertHtml(template, [
      'p#dashed-id.underscored_class_name = this.outputNumber'
    ],
    '<p class="underscored_class_name" id="dashed-id">1337</p>',
    {});
  });

  test('25. dashed attributes', function() {
    assertHtml(template, [
      'p data-info="Illudium Q-36" = this.outputNumber'
    ],
    '<p data-info="Illudium Q-36">1337</p>',
    {});
  });

  test('26. dashed attributes with shortcuts', function() {
    assertHtml(template, [
      'p#marvin.martian data-info="Illudium Q-36" = this.outputNumber'
    ],
    '<p class="martian" data-info="Illudium Q-36" id="marvin">1337</p>',
    {});
  });

  test('27. parens around attributes', function() {
    assertHtml(template, [
      'p(id="marvin" class="martian" data-info="Illudium Q-36") = this.outputNumber'
    ],
    '<p class="martian" data-info="Illudium Q-36" id="marvin">1337</p>',
    {});
  });

  test('28. square brackets around attributes', function() {
    assertHtml(template, [
      'p[id="marvin" class="martian" data-info="Illudium Q-36"] = this.outputNumber'
    ],
    '<p class="martian" data-info="Illudium Q-36" id="marvin">1337</p>',
    {});
  });

  test('29. parens around attributes with equal sign snug to right paren', function() {
    assertHtml(template, [
      'p(id="marvin" class="martian" data-info="Illudium Q-36")= this.outputNumber'
    ],
    '<p class="martian" data-info="Illudium Q-36" id="marvin">1337</p>',
    {});
  });

  test('30. closed tag', function() {
    assertHtml(template, [
      'closed/'
    ],
    '<closed />',
    {});
  });

  test('31. attributes with parens and spaces', function() {
    assertHtml(template, [
      'label[ for=\'filter\' ]= this.helloWorld'
    ],
    '<label for="filter">Hello World from @env</label>',
    {});
  });

  test('32. attributes with parens and spaces 2', function() {
    assertHtml(template, [
      'label[ for=\'filter\' ] = this.helloWorld'
    ],
    '<label for="filter">Hello World from @env</label>',
    {});
  });

  test('33. attributes with multiple spaces', function() {
    assertHtml(template, [
      'label  for=\'filter\'  class="test" = this.helloWorld'
    ],
    '<label class="test" for="filter">Hello World from @env</label>',
    {});
  });

  test('34. closed tag with attributes', function() {
    assertHtml(template, [
      'closed id="test" /'
    ],
    '<closed id="test" />',
    {});
  });

  test('35. closed tag with attributes and parens', function() {
    assertHtml(template, [
      'closed(id="test")/'
    ],
    '<closed id="test" />',
    {});
  });

  test('36. render with html comments', function() {
    assertHtml(template, [
      'p Hello',
      '/! This is a comment',
      '',
      '   Another comment',
      'p World'
    ],
    '<p>Hello</p><!--This is a comment\n\nAnother comment--><p>World</p>',
    {});
  });

  test('37. render with html conditional and tag', function() {
    assertHtml(template, [
      '/[ if IE ]',
      ' p Get a better browser.'
    ],
    '<!--[if IE]><p>Get a better browser.</p><![endif]-->',
    {});
  });

  test('38. render with html conditional and method output', function() {
    assertHtml(template, [
      '/[ if IE ]',
      ' = this.message(\'hello\')'
    ],
    '<!--[if IE]>hello<![endif]-->',
    {});
  });

  test('39. multiline attributes with method', function() {
    assertHtml(template, [
      'p(id="marvin"',
      'class="martian"',
      ' data-info="Illudium Q-36") = this.outputNumber'
    ],
    '<p class="martian" data-info="Illudium Q-36" id="marvin">1337</p>',
    {});
  });

  test('40. multiline attributes with text on same line', function() {
    assertHtml(template, [
      'p[id="marvin"',
      '  class="martian"',
      ' data-info="Illudium Q-36"] THE space modulator'
    ],
    '<p class="martian" data-info="Illudium Q-36" id="marvin">THE space modulator</p>',
    {});
  });

  test('41. multiline attributes with nested text', function() {
    assertHtml(template, [
      'p(id="marvin"',
      '  class="martian"',
      'data-info="Illudium Q-36")',
      '  | THE space modulator'
    ],
    '<p class="martian" data-info="Illudium Q-36" id="marvin">THE space modulator</p>',
    {});
  });

  test('42. multiline attributes with dynamic attr', function() {
    assertHtml(template, [
      'p[id=this.idHelper',
      '  class="martian"',
      '  data-info="Illudium Q-36"]',
      '  | THE space modulator'
    ],
    '<p class="martian" data-info="Illudium Q-36" id="notice">THE space modulator</p>',
    {});
  });

  test('43. multiline attributes with nested tag', function() {
    assertHtml(template, [
      'p(id=this.idHelper',
      '  class="martian"',
      '  data-info="Illudium Q-36")',
      '  span.emphasis THE',
      '  |  space modulator'
    ],
    '<p class="martian" data-info="Illudium Q-36" id="notice"><span class="emphasis">THE</span> space modulator</p>',
    {});
  });

  test('44. multiline attributes with nested text and extra indentation', function() {
    assertHtml(template, [
      'li( id="myid"',
      '    class="myclass"',
      'data-info="myinfo")',
      '  a href="link" My Link'
    ],
    '<li class="myclass" data-info="myinfo" id="myid"><a href="link">My Link</a></li>',
    {});
  });

  test('45. block expansion support', function() {
    assertHtml(template, [
      'ul',
      '  li.first: a href=\'a\' foo',
      '  li:       a href=\'b\' bar',
      '  li.last:  a href=\'c\' baz'
    ],
    '<ul><li class=\"first\"><a href=\"a\">foo</a></li><li><a href=\"b\">bar</a></li><li class=\"last\"><a href=\"c\">baz</a></li></ul>',
    {});
  });

  test('46. block expansion class attributes', function() {
    assertHtml(template, [
      '.a: .b: #c d'
    ],
    '<div class="a"><div class="b"><div id="c">d</div></div></div>',
    {});
  });

  test('47. block expansion nesting', function() {
    assertHtml(template, [
      'html: body: .content',
      '  | Text'
    ],
    '<html><body><div class=\"content\">Text</div></body></html>',
    {});
  });

  test('48. eval attributes once', function() {
    assertHtml(template, [
      'input[value=++this.x]',
      'input[value=++this.x]'
    ],
    '<input value="1" /><input value="2" />',
    {});
  });

  test('49. html line indicator', function() {
    assertHtml(template, [
      '<html>',
      '  head',
      '    meta name="keywords" content=this.helloWorld',
      '  - if true',
      '    <p>${this.helloWorld}</p>',
      '      span = this.helloWorld',
      '</html>'
    ],
    '<html><head><meta content="Hello World from @env" name="keywords" /></head><p>Hello World from @env</p><span>Hello World from @env</span></html>',
    {});
  });

  test('50. html line indicator issue #4', function() {
    assertHtml(template, [
      '<script>',
      '  | var a=b;',
      '</script>'
    ],
    '<script>var a=b;</script>',
    {});
  });

  test('51. leading whitespace indicator on tag', function() {
    assertHtml(template, [
      'p< text'
    ],
    ' <p>text</p>',
    {});
  });

  test('52. trailing whitespace indicator on tag', function() {
    assertHtml(template, [
      'p> text'
    ],
    '<p>text</p> ',
    {});
  });

  test('53. trailing whitespace with code', function() {
    assertHtml(template, [
      'p => "text"'
    ],
    '<p>text</p> ',
    {});
    assertHtml(template, [
      'p> = "text"'
    ],
    '<p>text</p> ',
    {});
  });

  test('54. test current context in partials by default', function() {
    const VM = template.VM;
    const vm = new VM();
    vm.resetCache();

    const compileOptions = {
      basePath: '/',
      filename: 'a'
    };

    vm.cache(compileOptions.filename, template.exec([
      'p Partial ${this.who}',
    ].join('\n'), compileOptions, vm));


    const src = [
      'p Current ${this.who}',
      '= partial("a")',
      '- this.who = "Another"',
      'p Current ${this.who}',
      '= partial("a")',
    ].join('\n');

    const result = template.render(src, {who: 'World', what: 'the best'}, compileOptions, vm);
    expect(result).toEqual('<p>Current World</p><p>Partial World</p><p>Current Another</p><p>Partial Another</p>');
  });
});
