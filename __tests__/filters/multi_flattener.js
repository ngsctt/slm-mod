import { expect } from 'jsr:@std/expect';
import { beforeEach, describe, test } from 'jsr:@std/testing/bdd'
import MultiFlattener from '../../lib/filters/multi_flattener.js';

describe('MultiFlattener', function() {

  let filter;

  beforeEach(function() {
    filter = new MultiFlattener();
  });

  test('1. flatten nested multi expressions', function() {
    expect(
      filter.exec(
        [
          'multi',
          ['static', 'a'],
          [
            'multi',
            ['dynamic', 'aa'],
            [
              'multi',
              ['static', 'aaa'],
              ['static', 'aab']
            ],
            ['dynamic', 'ab']
          ],
          ['static', 'b']
        ]
      )).toEqual(['multi',
        ['static', 'a'],
        ['dynamic', 'aa'],
        ['static', 'aaa'],
        ['static', 'aab'],
        ['dynamic', 'ab'],
        ['static', 'b']
      ]);
  });
});
