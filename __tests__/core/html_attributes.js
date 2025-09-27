import { expect } from 'jsr:@std/expect';
import { beforeEach, describe, test } from 'jsr:@std/testing/bdd'
import Template from '../../lib/template.js';
import VM from '../../lib/vm.js';
import { assertHtml } from '../helper.js';

describe('Html attribtues', function() {
  let template;
  let htmlTemplate;

  beforeEach(function() {
    template = new Template(VM);
    htmlTemplate = new Template(VM, {mergeAttrs: { 'class': ' ' }, attrDelims: { '(': ')' },  format: 'html' });
  });

  test('1. vue syntax 1', function() {
    assertHtml(template, [
      'form @submit.prevent="createdProject"'
      ],
      '<form @submit.prevent="createdProject"></form>',
      {});
  });

  test('2. vue syntax 2', function() {
    assertHtml(template, [
      'form(@submit.prevent="createdProject")'
      ],
      '<form @submit.prevent="createdProject"></form>',
      {});
  });

  test('3. vue syntax 3', function() {
    assertHtml(template, [
      'form v-on:submit="something"'
      ],
      '<form v-on:submit="something"></form>',
      {});
  });

  test('4. vue syntax 4', function() {
    assertHtml(template, [
      'form Hello.'
      ],
      '<form>Hello.</form>',
      {});
  });

  test('5. ternary operation in attribute', function() {
    assertHtml(template, [
      'p id="${(false ? \'notshown\' : \'shown\')}" = this.outputNumber'
      ],
      '<p id="shown">1337</p>',
      {});
  });

  test('6. ternary operation in attribute 2', function() {
    assertHtml(template, [
      'p id=(false ? \'notshown\' : \'shown\') = this.outputNumber'
      ],
      '<p id="shown">1337</p>',
      {});
  });

  test('7. class attribute merging', function() {
    assertHtml(template, [
      '.alpha class="beta" test it'
      ],
      '<div class="alpha beta">test it</div>',
      {});
  });

  test('8. class attribute merging with null', function() {
    assertHtml(template, [
      '.alpha class="beta" class=null class="gamma" test it'
      ],
      '<div class="alpha beta gamma">test it</div>',
      {});
  });

  test('9. class attribute merging with empty static', function() {
    assertHtml(template, [
      '.alpha class="beta" class="" class="gamma" Test it'
      ],
      '<div class="alpha beta gamma">Test it</div>',
      {});
  });

  test('10. id attribute merging', function() {
    const tmpl = new Template(VM, {mergeAttrs: {'id': '-'}});
    assertHtml(tmpl, [
      '#alpha id="beta" Test it'
      ],
      '<div id="alpha-beta">Test it</div>',
      {});
  });

  test('11. throws multiple id merge by default', function() {
    expect(function() {
      assertHtml(template, [
        '#alpha id="beta" Test it'
        ],
        '<div id="alpha-beta">Test it</div>',
        {});
    }).toThrow('Multiple id attributes specified');
  });

  test('12. id attribute merging with array', function() {
    const tmpl = new Template(VM, {mergeAttrs: {'id': '_'}});
    assertHtml(tmpl, [
      '#alpha id=["beta", "gamma"] Test it'
      ],
      '<div id="alpha_beta_gamma">Test it</div>',
      {});
  });

  test('13. custom attribute delimiters', function() {
    assertHtml(htmlTemplate, [
      'div([value]="boundValue")',
      ],
      '<div [value]="boundValue"></div>',
      {});
  });

  test('14. xhtml boolean attribute false', function() {
    assertHtml(template, [
      '- var cond = false',
      'option selected=false Text',
      'option selected=undefined Text2',
      'option selected=cond Text3'
      ],
      '<option>Text</option><option>Text2</option><option>Text3</option>',
      {});
  });

  test('15. html boolean attribute false', function() {
    assertHtml(htmlTemplate, [
      '- var cond = false',
      'option selected=false Text',
      'option selected=undefined Text2',
      'option selected=cond Text3'
      ],
      '<option>Text</option><option>Text2</option><option>Text3</option>',
      {});
  });

  test('16. xhtml boolean attribute true', function() {
    assertHtml(template, [
      '- var cond = true',
      'option selected=true Text',
      'option selected=1 Text2',
      'option selected=cond Text3'
      ],
      '<option selected="">Text</option><option selected="1">Text2</option><option selected="">Text3</option>',
      {});
  });

  test('17. html boolean attribute true', function() {
    assertHtml(htmlTemplate, [
      '- var cond = true',
      'option selected=true Text',
      'option selected=1 Text2',
      'option selected=cond Text3'
      ],
      '<option selected>Text</option><option selected="1">Text2</option><option selected>Text3</option>',
      {});
  });

  test('18. xhtml boolean attribute null', function() {
    assertHtml(template, [
      '- var cond = null',
      'option selected=null Text',
      'option selected=cond Text2'
      ],
      '<option>Text</option><option>Text2</option>',
      {});
  });

  test('19. html boolean attribute null', function() {
    assertHtml(htmlTemplate, [
      '- var cond = null',
      'option selected=null Text',
      'option selected=cond Text2'
      ],
      '<option>Text</option><option>Text2</option>',
      {});
  });

  test('20. boolean attribute string2', function() {
    assertHtml(template, [
      'option selected="selected" Text'
      ],
      '<option selected="selected">Text</option>',
      {});
  });

  test('21. xhtml boolean attribute shortcut', function() {
    assertHtml(template, [
      'option(class="clazz" selected) Text',
      'option(selected class="clazz") Text'
      ],
      '<option class="clazz" selected="">Text</option><option class="clazz" selected="">Text</option>',
      {});
  });

  test('22. html boolean attribute shortcut', function() {
    assertHtml(htmlTemplate, [
      'option(class="clazz" selected) Text',
      'option(selected class="clazz") Text'
      ],
      '<option class="clazz" selected>Text</option><option class="clazz" selected>Text</option>',
      {});
  });

  test('23. array attribute merging', function() {
    assertHtml(template, [
      '.alpha class="beta" class=[[""], "gamma", null, "delta", [true, false]]',
      '.alpha class=["beta","gamma"]'
      ],
      '<div class="alpha beta gamma delta true false"></div><div class="alpha beta gamma"></div>',
      {});
  });

  test('24. static empty attribute', function() {
    assertHtml(template, [
      'p(id="marvin" name="" class="" data-info="Illudium Q-36")= this.outputNumber'
      ],
      '<p data-info="Illudium Q-36" id="marvin" name="">1337</p>',
      {});
  });

  test('25. dynamic empty attribute', function() {
    assertHtml(template, [
      'p(id="marvin" class=null nonempty=("".toString()) data-info="Illudium Q-36")= this.outputNumber'
      ],
      '<p data-info="Illudium Q-36" id="marvin" nonempty="">1337</p>',
      {});
  });

  test('26. weird attribute', function() {
    assertHtml(template, [
      'p',
      '  img(src=\'img.png\' whatsthis?!)'
    ],
    '<p><img src="img.png" whatsthis?!="" /></p>',
    {});
  });
});
