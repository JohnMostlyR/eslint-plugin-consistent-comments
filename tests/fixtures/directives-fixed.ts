/* This file tests directive patterns */

/// <reference types="node" />
/// <reference path="./types.d.ts" />

/*
 * Valid TypeScript directives
 * @ts-ignore: intentionally ignoring this
 * @ts-expect-error: expecting an error here
 * @ts-nocheck
 */

/*
 * Valid ESLint directives
 * eslint-disable-next-line no-unused-vars
 * eslint-disable no-console
 * eslint-disable-line no-explicit-any
 */

/*
 * Valid testing directives
 * istanbul ignore next
 * istanbul ignore next
 */
// prettier-ignore
/* ISTANBUL   IGNORE-NEXT */

/*
 * Valid Deno directives
 * deno-lint-ignore no-explicit-any
 */

/*
 * Fake directives that should be converted to multi-line
 * @ts-ignoreX this is not a real directive
 * eslint-wtf should be fixed
 * istanbul-ignoreer not a directive
 * @fake-directive this should be multi-line
 */

/*
 * Regular text comments
 * This is just a regular comment about the code
 */

const code = 'real code';

/* Block comment for documentation */
export { code };
