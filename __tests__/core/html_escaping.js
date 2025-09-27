import { beforeEach, describe, test } from 'jsr:@std/testing/bdd'
import Template from '../../lib/template.js';
import VM from '../../lib/vm.js';
import { assertHtml } from '../helper.js';

describe('Html escaping', function() {
  let template;
  beforeEach(function() {
    template = new Template(VM);
  });

  test('1. html will not be escaped', function() {
    assertHtml(template, [
      'p <Hello> World, meet "Slm".'
      ],
      '<p><Hello> World, meet "Slm".</p>',
      {});
  });

  test('2. html with newline will not be escaped', function() {
    assertHtml(template, [
      'p',
      '  |',
      '    <Hello> World,',
      '     meet "Slim".'
      ],
      '<p><Hello> World,\n meet "Slim".</p>',
      {});
  });

  test('3. html with escaped interpolation', function() {
    assertHtml(template, [
      '- var x = \'"\'',
      '- var content = \'<x>\'',
      'p class="${x}" test ${content}'
      ],
      '<p class="&quot;">test &lt;x&gt;</p>',
      {});
  });

  test('4. html with raw interpolation', function() {
    assertHtml(template, [
      '- var x = "text<br/>"',
      'p ${=x}',
      'p $y=1',
      'p y$=x',
      'p y$y=x'
      ],
      '<p>text<br/></p><p $y="1"></p><p y$="text&lt;br/&gt;"></p><p y$y="text&lt;br/&gt;"></p>',
      {});
  });

  test('5. html nested escaping', function() {
    assertHtml(template, [
      '= this.helloBlock(function())',
      '  | escaped &'
      ],
      'Hello World from @env escaped &amp; Hello World from @env',
      {});
  });

  test('6. html quoted attr escape', function() {
    assertHtml(template, [
      'p id="&" class=="&amp;"'
      ],
      '<p class="&amp;" id="&amp;"></p>',
      {});
  });

  test('7. html quoted attr escape with interpolation', function() {
    assertHtml(template, [
      'p id="&${\'"\'}" class=="&amp;${\'"\'}"',
      'p id="&${=\'"\'}" class=="&amp;${=\'"\'}"'
      ],
      '<p class="&amp;&quot;" id="&amp;&quot;"></p><p class="&amp;"" id="&amp;""></p>',
      {});
  });

  test('8. html js attr escape', function() {
    assertHtml(template, [
      'p id=(\'&\'.toString()) class==(\'&amp;\'.toString())'
      ],
      '<p class="&amp;" id="&amp;"></p>',
      {});
  });

  test('9. html json xss', function() {
    assertHtml(template, [
      'script:',
      '  var x = ${= j()};'
      ],
      '<script>var x = undefined;</script>',
      {});

    assertHtml(template, [
      'script:',
      '  var x = ${= j(this.address)};'
      ],
      '<script>var x = undefined;</script>',
      {address: '<script>alert("xss")</script>'});
  });
});
