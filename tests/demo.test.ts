/**
 * @description All examples in this file are to demonstrate the most basic usage of Vitest
 * @link https://cn.vitest.dev/api
 * @api describe: Forms a scope
 * @api test/it: Defines a set of methods for test expectations, it takes the test name and a function containing the test expectations
 * @api expect: Used to create assertions
 * @api toBe: Can be used to assert whether primitive types are equal, or whether objects share the same reference
 * @api toEqual: Asserts whether the actual value is equal to the received value or has the same structure (if it's an object, recursively compares them)
 */

import { describe, expect, it } from 'vitest';

const author1 = {
  name: 'pany',
  email: '939630029@qq.com',
  url: 'https://github.com/pany-ang'
};

const author2 = {
  name: 'pany',
  email: '939630029@qq.com',
  url: 'https://github.com/pany-ang'
};

describe('fill in the scope name here', () => {
  it('test basic data types', () => {
    expect(1 + 1).toBe(2);
  });

  it('test reference types', () => {
    expect(author1).toEqual(author2);
  });
});
