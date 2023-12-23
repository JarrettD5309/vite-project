import type CustomMatchers from 'jest-extended';
import 'vitest';

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {} //eslint-disable-line
  interface AsymmetricMatchersContaining<T = any> extends CustomMatchers<T> {} //eslint-disable-line
  interface ExpectStatic extends CustomMatchers<T> {}
}