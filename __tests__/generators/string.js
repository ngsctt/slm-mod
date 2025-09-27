import { expect } from 'jsr:@std/expect';
import { beforeEach, describe, test } from 'jsr:@std/testing/bdd'
import Generator from '../../lib/generators/string.js';

describe('String generator', function() {
  let generator = null;

  beforeEach(function() {
    generator = new Generator();
  });

  test('1. compiles simple expressions', function() {
    expect(generator.exec(['static', 'test'])).toEqual(
      'var _b=\'\';_b+="test";',
    );
    expect(generator.exec(['dynamic', 'test'])).toEqual("var _b='';_b+=test;");
    expect(generator.exec(['code', 'test'])).toEqual("var _b='';test");
  });

  test('2. compiles multi expression', function() {
    expect(
      generator.exec([
        'multi',
        ['static', 'static'],
        ['dynamic', 'dynamic'],
        ['code', 'code'],
      ]),
    ).toEqual('var _b=\'\';_b+="static";\n_b+=dynamic;\ncode');
  });

  test('3. throws an error on unknown expression', function() {
    expect(function() {
      generator.exec(['multi', ['unknown', 'static'], ['code', 'code']]);
    }).toThrow(
      'Generator supports only core expressions - found ["unknown","static"]',
    );
  });
});
