import { expect } from 'jsr:@std/expect';
import { beforeEach, describe, test } from 'jsr:@std/testing/bdd'
import Filter from '../../lib/html/fast.js';

describe('Fast', function() {

  let filter;

  beforeEach(function() {
    filter = new Filter();
  });

  test('1. compile html doctype', function() {
    expect(filter.exec(['multi', ['html', 'doctype', 'html']]))
    .toEqual(['multi', ['static', '<!DOCTYPE html>']]);

    expect(filter.exec(['multi', ['html', 'doctype', '5']]))
    .toEqual(['multi', ['static', '<!DOCTYPE html>']]);

    expect(filter.exec(['multi', ['html', 'doctype', '1.1']]))
    .toEqual(
      ['multi',
        ['static', '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">']
      ]
    );
  });

  test('2. compile xml encoding', function() {
    expect(filter.exec(['html', 'doctype', 'xml latin1']))
    .toEqual(['static', '<?xml version="1.0" encoding="latin1" ?>']);
  });

  test('3. compile html comment', function() {
    expect(filter.exec(['html', 'comment', ['static', 'test']]))
    .toEqual(['multi', ['static', '<!--'], ['static', 'test'], ['static', '-->']]);
  });

  test('4. compile js wrapped in comments', function() {
    expect(filter.exec(['html', 'js', ['static', 'test']]))
      .toEqual(
      ['multi', ['static', '\n//<![CDATA[\n'], ['static', 'test'], ['static', '\n//]]>\n']]
    );
  });

  test('5. compile autoclosed html tag', function() {
    expect(
      filter.exec(['html', 'tag',
        'img', ['attrs'],
        ['multi', ['newline']]
      ])).toEqual(
      ['multi',
        ['static', '<img'],
        ['attrs'],
        ['static', ' />'],
        ['multi', ['newline']]]
    );
  });

  test('6. compile explicitly closed html tag', function() {
    expect(
      filter.exec(['html', 'tag', 'closed', ['attrs']])
    ).toEqual(
      ['multi',
        ['static', '<closed'],
        ['attrs'],
        ['static', ' />']
      ]
    );
  });

  test('7. compile html with content', function() {
    expect(
      filter.exec(['html', 'tag',
      'div', ['attrs'], ['content']]),
    ).toEqual(
      ['multi',
        ['static', '<div'],
        ['attrs'],
        ['static', '>'],
        ['content'],
        ['static', '</div>']
      ]
    );
  });

  test('8. compile html with attrs', function() {
    expect(
      filter.exec(['html', 'tag', 'div',
        ['html', 'attrs',
          ['html', 'attr', 'id', ['static', 'test']],
          ['html', 'attr', 'class', ['dynamic', 'block']]],
        ['content']
      ])
    ).toEqual(
      ['multi',
        ['static', '<div'],
        ['multi',
          ['multi', ['static', ' id="'], ['static', 'test'], ['static', '"']],
          ['multi', ['static', ' class="'], ['dynamic', 'block'], ['static', '"']]],
        ['static', '>'],
        ['content'],
        ['static', '</div>']
      ]);
  });

  test('9. keep codes intact', function() {
    expect(filter.exec(['multi', ['code', 'foo']])).toEqual(['multi', ['code', 'foo']]);
  });

  test('10. should keep statics intact', function() {
    expect(filter.exec(['multi', ['static', '<']])).toEqual(['multi', ['static', '<']]);
  });

  test('11. should keep dynamic intact', function() {
    expect(filter.exec(['multi', ['dynamic', 'foo']])).toEqual(['multi', ['dynamic', 'foo']]);
  });

});
