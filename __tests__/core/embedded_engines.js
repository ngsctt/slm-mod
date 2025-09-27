import { expect } from 'jsr:@std/expect';
import { describe, beforeEach, test } from 'jsr:@std/testing/bdd'
import Template from '../../lib/template.js';
import VM from '../../lib/vm.js';
import { assertHtml } from '../helper.js';

describe('Embedded engines', function() {
  let template;

  beforeEach(function() {
    template = new Template(VM);
    template.registerEmbeddedFunction('customEngine', function(body) {
      return '<pre>' + body + '</pre>';
    });
  });

  test('1. render with javascript', function() {
    assertHtml(template, [
      'javascript:   ',
      '  $(function() {});',
      '',
      '',
      '  alert(\'hello\')',
      'p Hi'
      ],
      '<script type="text/javascript">$(function() {});\n\n\nalert(\'hello\')</script><p>Hi</p>',
      {});
  });

  test('2. render with script', function() {
    assertHtml(template, [
      'script:   ',
      '  $(function() {});',
      '',
      '',
      '  alert(\'hello\')',
      'p Hi'
      ],
      '<script>$(function() {});\n\n\nalert(\'hello\')</script><p>Hi</p>',
      {});
  });

  test('3. render with javascript including variable', function() {
    assertHtml(template, [
      '- var func = "alert(\'hello\');"',
      'javascript:   ',
      '  $(function() { ${func} });'
      ],
      '<script type="text/javascript">$(function() { alert(\'hello\'); });</script>',
      {});
  });

  test('4. render with css', function() {
    assertHtml(template, [
      'css:',
      '  body { color: red; }'
      ],
      '<style type="text/css">body { color: red; }</style>',
      {});
  });

  test('5. render with custom engine', function() {
    assertHtml(template, [
      'customEngine:',
      '  text ${this.helloWorld}',
      '  text ${this.helloWorld}!'
      ],
      '<pre>text Hello World from @env\ntext Hello World from @env!</pre>',
      {});
  });

  test('6. throws an error on unregistered engine', function() {
    expect(function() {
      assertHtml(template, [
        'unregistered:',
        '  text'
        ],
        '', {});
    }).toThrow('Embedded engine unregistered is not registered.');
  });
});
