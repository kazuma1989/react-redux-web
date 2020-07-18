declare module 'baretest' {
  interface Test {
    (name: string, fn: Function): void
    only(name: string, fn: Function): void
    before(fn: Function): void
    after(fn: Function): void
    skip(name?: string, fn?: Function): void
    run(): Promise<boolean>
  }

  export default function baretest(headline: string): Test
}

declare module 'assert' {
  type AssertPredicate =
    | RegExp
    | (new () => object)
    | ((thrown: any) => boolean)
    | object
    | Error

  function fail(message?: string | Error): never
  function ok(value: any, message?: string | Error): void
  function equal(actual: any, expected: any, message?: string | Error): void
  function notEqual(actual: any, expected: any, message?: string | Error): void
  function deepEqual(actual: any, expected: any, message?: string | Error): void
  function notDeepEqual(
    actual: any,
    expected: any,
    message?: string | Error,
  ): void
  function strictEqual(
    actual: any,
    expected: any,
    message?: string | Error,
  ): void
  function notStrictEqual(
    actual: any,
    expected: any,
    message?: string | Error,
  ): void
  function deepStrictEqual(
    actual: any,
    expected: any,
    message?: string | Error,
  ): void
  function notDeepStrictEqual(
    actual: any,
    expected: any,
    message?: string | Error,
  ): void

  function throws(block: () => any, message?: string | Error): void
  function throws(
    block: () => any,
    error: AssertPredicate,
    message?: string | Error,
  ): void
  function doesNotThrow(block: () => any, message?: string | Error): void
  function doesNotThrow(
    block: () => any,
    error: RegExp | Function,
    message?: string | Error,
  ): void

  function ifError(value: any): void

  function rejects(
    block: (() => Promise<any>) | Promise<any>,
    message?: string | Error,
  ): Promise<void>
  function rejects(
    block: (() => Promise<any>) | Promise<any>,
    error: AssertPredicate,
    message?: string | Error,
  ): Promise<void>
  function doesNotReject(
    block: (() => Promise<any>) | Promise<any>,
    message?: string | Error,
  ): Promise<void>
  function doesNotReject(
    block: (() => Promise<any>) | Promise<any>,
    error: RegExp | Function,
    message?: string | Error,
  ): Promise<void>

  function match(value: string, regExp: RegExp, message?: string | Error): void
  function doesNotMatch(
    value: string,
    regExp: RegExp,
    message?: string | Error,
  ): void
}
