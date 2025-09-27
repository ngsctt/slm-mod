import { expect } from 'jsr:@std/expect';
import { beforeEach, describe, test } from 'jsr:@std/testing/bdd'
import ControlFlow from '../../lib/filters/control_flow.js';

describe('ControlFlow', function() {

  let filter;

  beforeEach(function() {
    filter = new ControlFlow();
  });

  test('1. should process blocks', function(){
    expect(
      filter.exec(['block', 'while (true)', ['static', 'Hello']])
    ).toEqual(
      ['multi',
        ['code', 'while (true)'],
        ['static', 'Hello']
      ]
    );
  });

  test('2. should process if', function(){
    expect(
      filter.exec(['if', 'condition', ['static', 'Hello']])
    ).toEqual(
      ['multi',
        ['code', 'if(condition){'],
        ['static', 'Hello'],
        ['code', '}']
      ]
    );
  });

  test('3. should process if with else', function(){
    expect(
      filter.exec(['if', 'condition', ['static', 'True'], ['static', 'False']])
    ).toEqual(
      ['multi',
        ['code', 'if(condition){'],
        ['static', 'True'],
        ['code', '}else{'],
        ['static', 'False'],
        ['code', '}']
      ]
    );
  });

});
