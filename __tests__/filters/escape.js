import { expect } from 'jsr:@std/expect';
import { beforeEach, describe, test } from 'jsr:@std/testing/bdd'
import Escape from '../../lib/filters/escape.js';

describe('Escape', function() {

  let filter;

  beforeEach(function() {
    filter = new Escape();
  });

  test('1. handle escape expressions', function(){
    expect(
      filter.exec(['escape', true,
                    ['multi',
                     ['static', 'a < b'],
                     ['dynamic', 'this.jsMethod()']]
      ])).toEqual(
      ['multi',
        ['static', 'a &lt; b'],
        ['dynamic', 'vm.escape(this.jsMethod())']
      ]
    );
  });

  test('2. keep codes intact', function() {
    expect(filter.exec(['multi', ['code', 'foo']])).toEqual(['multi', ['code', 'foo']]);
  });

  test('3. keep statics intact', function() {
    expect(filter.exec(['multi', ['static', '<']])).toEqual(['multi', ['static', '<']]);
  });

  test('4. keep dynamic intact', function() {
    expect(filter.exec(['multi', ['dynamic', 'foo']])).toEqual(['multi', ['dynamic', 'foo']]);
  });

  test('5. use htmlSafe flag', function() {
    const src = new String('a < b');
    src.htmlSafe = true;
    expect(
      filter.exec(['escape', true, ['static', src]])
    ).toEqual(
      ['static', src + '']
    );
  });

});
