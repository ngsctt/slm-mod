import { beforeEach, describe, test } from 'jsr:@std/testing/bdd'
import Template from '../../lib/template.js';
import VM from '../../lib/vm.js';
import { assertSyntaxError } from '../helper.js';

describe('Parser errors', function() {

  let template;

  beforeEach(function() { template = new Template(VM); });

  test('1. correct filename', function() {
    assertSyntaxError(template, [
      'doctype 5',
      '  div Invalid'
      ],
      'Unexpected indentation\n  test.slm, Line 2, Column 3\n    div Invalid\n    ^\n',
      {filename: 'test.slm'});
  });

  test('2. unexpected indentation', function() {
    assertSyntaxError(template, [
      'doctype 5',
      '  div Invalid'
      ],
      'Unexpected indentation\n  (__TEMPLATE__), Line 2, Column 3\n    div Invalid\n    ^\n',
      {});
  });

  test('3. unexpected text indentation', function() {
    assertSyntaxError(template, [
      'p',
      '  | text block',
      '   text'
      ],
      'Text line not indented deep enough.\nThe first text line defines the necessary text indentation.\n  (__TEMPLATE__), Line 3, Column 4\n     text\n     ^\n',
      {});
  });

  test('4. unexpected text indentation in tag', function() {
    assertSyntaxError(template, [
      'ul',
      '  li List1',
      '    ul',
      '      li a',
      '      li b',
      '  li List2',
      '    ul',
      '      li a',
      '      li b'
      ],
      'Text line not indented deep enough.\nThe first text line defines the necessary text indentation.\nAre you trying to nest a child tag in a tag containing text? Use | for the text block!\n  (__TEMPLATE__), Line 3, Column 5\n      ul\n      ^\n',
      {});
  });

  test('5. malformed indentation', function() {
    assertSyntaxError(template, [
      'p',
      '  div Valid',
      ' div Invalid'
      ],
      'Malformed indentation\n  (__TEMPLATE__), Line 3, Column 2\n   div Invalid\n   ^\n',
      {});
  });

  test('6. malformed indentation 2', function() {
    assertSyntaxError(template, [
      '  div Valid',
      ' div Invalid'
      ],
      'Malformed indentation\n  (__TEMPLATE__), Line 2, Column 2\n   div Invalid\n   ^\n',
      {});
  });

  test('7. unknown line indicator', function() {
    assertSyntaxError(template, [
      'p',
      '  div Valid',
      '  .valid',
      '  #valid',
      '  ?invalid'
      ],
      'Unknown line indicator\n  (__TEMPLATE__), Line 5, Column 3\n    ?invalid\n    ^\n',
      {});
  });

  test('8. expected closing delimiter', function() {
    assertSyntaxError(template, [
      'p',
      '  img(src="img.jpg" title=(title)'
      ],
      'Expected closing delimiter )\n  (__TEMPLATE__), Line 2, Column 34\n    img(src=\"img.jpg\" title=(title)\n                                   ^\n',
      {});
  });

  test('9. missing quote unexpected end', function() {
    assertSyntaxError(template, [
      'p',
      '  img(src="img.jpg'
      ],
      'Unexpected end of file\n  (__TEMPLATE__), Line 2, Column 1\n  \n  ^\n',
      {});
  });

  test('10. expected closing attribute delimiter', function() {
    assertSyntaxError(template, [
      'p',
      '  img src=[hash[1] + hash[2]'
      ],
      'Expected closing delimiter ]\n  (__TEMPLATE__), Line 2, Column 29\n    img src=[hash[1] + hash[2]\n                              ^\n',
      {});
  });

  test('11. invalid empty attribute', function() {
    assertSyntaxError(template, [
      'p',
      '  img[src= ]'
      ],
      'Invalid empty attribute\n  (__TEMPLATE__), Line 2, Column 12\n    img[src= ]\n             ^\n',
      {});
  });

  test('12. invalid empty attribute 2', function() {
    assertSyntaxError(template, [
      'p',
      '  img[src=]'
      ],
      'Invalid empty attribute\n  (__TEMPLATE__), Line 2, Column 11\n    img[src=]\n            ^\n',
      {});
  });

  test('13. invalid empty attribute 3', function() {
    assertSyntaxError(template, [
      'p',
      '  img src='
      ],
      'Invalid empty attribute\n  (__TEMPLATE__), Line 2, Column 11\n    img src=\n            ^\n',
      {});
  });

  test('14. missing tag in block expansion', function() {
    assertSyntaxError(template, [
      'html: body:'
      ],
      'Expected tag\n  (__TEMPLATE__), Line 1, Column 12\n  html: body:\n             ^\n',
      {});
  });

  test('15. invalid tag in block expansion', function() {
    assertSyntaxError(template, [
      'html: body: /comment'
      ],
      'Expected tag\n  (__TEMPLATE__), Line 1, Column 13\n  html: body: /comment\n              ^\n',
      {});

    assertSyntaxError(template, [
      'html: body:/comment'
      ],
      'Expected tag\n  (__TEMPLATE__), Line 1, Column 12\n  html: body:/comment\n             ^\n',
      {});
  });

  test('16. unexpected text after closed', function() {
    assertSyntaxError(template, [
      'img / text'
      ],
      'Unexpected text after closed tag\n  (__TEMPLATE__), Line 1, Column 7\n  img / text\n        ^\n',
      {});
  });

  test('17. illegal shortcuts', function() {
    assertSyntaxError(template, [
      '.#test'
      ],
      'Illegal shortcut\n  (__TEMPLATE__), Line 1, Column 1\n  .#test\n  ^\n',
      {});
  });

  test('18. illegal shortcuts', function() {
    assertSyntaxError(template, [
      '.#test'
      ],
      'Illegal shortcut\n  (__TEMPLATE__), Line 1, Column 1\n  .#test\n  ^\n',
      {});

    assertSyntaxError(template, [
      'div.#test'
      ],
      'Illegal shortcut\n  (__TEMPLATE__), Line 1, Column 4\n  div.#test\n     ^\n',
      {});
  });

});
