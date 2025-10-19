import { RuleTester } from 'eslint';
import { describe } from 'vitest';

import plugin from '../src/index.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

const rule = plugin.rules!['comment-style']!;

describe('AST-based code detection', () => {
  describe('should correctly identify actual code vs text', () => {
    ruleTester.run('comment-style', rule, {
      valid: [
        /* Single-line comments with actual code should stay as single-line */
        {
          code: '// const x = 5;',
          filename: 'test.ts',
        },
        {
          code: '// function test() { return true; }',
          filename: 'test.ts',
        },
        {
          code: '// import { foo } from "bar";',
          filename: 'test.ts',
        },
        {
          code: '// x = 10 + 20;',
          filename: 'test.ts',
        },
        {
          code: '// return value;',
          filename: 'test.ts',
        },
        {
          code: '// [1, 2, 3].map(x => x * 2)',
          filename: 'test.ts',
        },
        /* Multi-line comments with text should stay as multi-line */
        {
          code: '/* This is a regular comment */',
          filename: 'test.ts',
        },
        {
          code: '/* TODO: fix this later */',
          filename: 'test.ts',
        },
        {
          code: '/* Note: this is important */',
          filename: 'test.ts',
        },
      ],
      invalid: [
        /* Block comments with code should become single-line */
        {
          code: '/* const x = 5; */',
          filename: 'test.ts',
          errors: [{ messageId: 'useSlashForCode' }],
          output: '// const x = 5;',
        },
        {
          code: '/* x + y */',
          filename: 'test.ts',
          errors: [{ messageId: 'useSlashForCode' }],
          output: '// x + y',
        },
        /* Single-line comments with text should become multi-line */
        {
          code: '// This is a regular comment',
          filename: 'test.ts',
          errors: [{ messageId: 'useMultiLineForText' }],
          output: '/* This is a regular comment */',
        },
        {
          code: '// TODO: implement this feature',
          filename: 'test.ts',
          errors: [{ messageId: 'useMultiLineForText' }],
          output: '/* TODO: implement this feature */',
        },
      ],
    });
  });

  describe('edge cases that regex might miss', () => {
    ruleTester.run('comment-style', rule, {
      valid: [
        /* Code-like text that is NOT valid code should use block comments */
        {
          code: '/* TODO: const x = incomplete syntax */',
          filename: 'test.ts',
        },
        {
          code: '/* Note about function() but not actual code */',
          filename: 'test.ts',
        },
      ],
      invalid: [
        /* Text that looks like it might have code but isn't valid should be multi-line */
        {
          code: '// This has function() in it but is not code',
          filename: 'test.ts',
          errors: [{ messageId: 'useMultiLineForText' }],
          output: '/* This has function() in it but is not code */',
        },
        /* Incomplete code syntax should be treated as text */
        {
          code: '// const x = incomplete syntax',
          filename: 'test.ts',
          errors: [{ messageId: 'useMultiLineForText' }],
          output: '/* const x = incomplete syntax */',
        },
        /* Valid expressions should be treated as code */
        {
          code: '/* true */',
          filename: 'test.ts',
          errors: [{ messageId: 'useSlashForCode' }],
          output: '// true',
        },
        {
          code: '/* 42 */',
          filename: 'test.ts',
          errors: [{ messageId: 'useSlashForCode' }],
          output: '// 42',
        },
        {
          code: '/* "string literal" */',
          filename: 'test.ts',
          errors: [{ messageId: 'useSlashForCode' }],
          output: '// "string literal"',
        },
      ],
    });
  });

  describe('complex JavaScript constructs', () => {
    ruleTester.run('comment-style', rule, {
      valid: [
        {
          code: '// { key: "value", foo: 123 }',
          filename: 'test.ts',
        },
        {
          code: '// [1, 2, 3, 4, 5]',
          filename: 'test.ts',
        },
        {
          code: '// () => console.log("test")',
          filename: 'test.ts',
        },
        {
          code: '// class MyClass extends Base {}',
          filename: 'test.ts',
        },
      ],
      invalid: [
        {
          code: '/* { key: "value", foo: 123 } */',
          filename: 'test.ts',
          errors: [{ messageId: 'useSlashForCode' }],
          output: '// { key: "value", foo: 123 }',
        },
        {
          code: '/* [1, 2, 3, 4, 5] */',
          filename: 'test.ts',
          errors: [{ messageId: 'useSlashForCode' }],
          output: '// [1, 2, 3, 4, 5]',
        },
      ],
    });
  });

  describe('ambiguous cases', () => {
    ruleTester.run('comment-style', rule, {
      valid: [
        /* URLs and paths are not code */
        {
          code: '/* https://example.com/path */',
          filename: 'test.ts',
        },
        {
          code: '/* /path/to/file.txt */',
          filename: 'test.ts',
        },
        /* Questions and natural language */
        {
          code: '/* What does this do? */',
          filename: 'test.ts',
        },
      ],
      invalid: [
        {
          code: '// https://example.com/path',
          filename: 'test.ts',
          errors: [{ messageId: 'useMultiLineForText' }],
          output: '/* https://example.com/path */',
        },
        {
          code: '// What does this do?',
          filename: 'test.ts',
          errors: [{ messageId: 'useMultiLineForText' }],
          output: '/* What does this do? */',
        },
      ],
    });
  });
});
