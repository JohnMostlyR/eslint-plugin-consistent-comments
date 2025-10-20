import { RuleTester } from 'eslint';
import { describe, expect, it } from 'vitest';

import plugin from '../src/index.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

const rule = plugin.rules!['comment-style']!;

describe('eslint-plugin-consistent-comments', () => {
  describe('comment-style rule', () => {
    it('should flag multi-line comments containing code', () => {
      ruleTester.run('comment-style', rule, {
        valid: [
          {
            code: '// const x = 5;',
            filename: 'test.ts',
          },
          {
            code: '/* This is a documentation comment */',
            filename: 'test.ts',
          },
          {
            code: '// function test() { return true; }',
            filename: 'test.ts',
          },
        ],
        invalid: [
          {
            code: '/* const x = 5; */',
            filename: 'test.ts',
            errors: [{ messageId: 'useSlashForCode' }],
            output: '// const x = 5;',
          },
          {
            code: '/* function test() { return true; } */',
            filename: 'test.ts',
            errors: [{ messageId: 'useSlashForCode' }],
            output: '// function test() { return true; }',
          },
          {
            code: '// This is a regular comment',
            filename: 'test.ts',
            errors: [{ messageId: 'useMultiLineForText' }],
            output: '/* This is a regular comment */',
          },
        ],
      });
    });

    it('should handle multi-line block comments with code', () => {
      ruleTester.run('comment-style', rule, {
        valid: [],
        invalid: [
          {
            code: `/*
  const x = 5;
  const y = 10;
*/`,
            filename: 'test.ts',
            errors: [{ messageId: 'useSlashForCode' }],
            output: `// const x = 5;
// const y = 10;`,
          },
        ],
      });
    });

    it('should correctly identify commented code patterns', () => {
      ruleTester.run('comment-style', rule, {
        valid: [
          {
            code: '// import { foo } from "bar";',
            filename: 'test.ts',
          },
          {
            code: '// export default class Test {}',
            filename: 'test.ts',
          },
        ],
        invalid: [
          {
            code: '/* import { foo } from "bar"; */',
            filename: 'test.ts',
            errors: [{ messageId: 'useSlashForCode' }],
            output: '// import { foo } from "bar";',
          },
        ],
      });
    });

    it('should detect object properties as code', () => {
      ruleTester.run('comment-style', rule, {
        valid: [
          {
            // Object property with trailing comma should be detected as code
            code: '// key: value,',
            filename: 'test.ts',
          },
          {
            // Complex object property with method calls
            code: '// ELECTRON_CLERK_PUBLISHABLE_KEY: z.string().min(1),',
            filename: 'test.ts',
          },
          {
            // Object property without trailing comma
            code: '// port: 3000',
            filename: 'test.ts',
          },
        ],
        invalid: [
          {
            // Object property in block comment should be converted to single-line
            code: '/* key: value, */',
            filename: 'test.ts',
            errors: [{ messageId: 'useSlashForCode' }],
            output: '// key: value,',
          },
          {
            code: '/* ELECTRON_CLERK_PUBLISHABLE_KEY: z.string().min(1), */',
            filename: 'test.ts',
            errors: [{ messageId: 'useSlashForCode' }],
            output: '// ELECTRON_CLERK_PUBLISHABLE_KEY: z.string().min(1),',
          },
        ],
      });
    });
  });

  describe('edge cases', () => {
    it('should not flag triple slash directives', () => {
      ruleTester.run('comment-style', rule, {
        valid: [
          {
            code: '/// <reference types="vitest/config" />',
            filename: 'test.ts',
          },
          {
            code: '/// <reference path="./types.d.ts" />',
            filename: 'test.ts',
          },
          {
            code: '// @ts-ignore: some reason',
            filename: 'test.ts',
          },
          {
            code: '// eslint-disable-next-line no-unused-vars',
            filename: 'test.ts',
          },
          // Additional directive variations
          {
            code: '  //   @ts-expect-error  ',
            filename: 'test.ts',
          },
          {
            code: '\t// istanbul ignore next',
            filename: 'test.ts',
          },
          {
            code: '/* prettier-ignore */',
            filename: 'test.ts',
          },
          {
            code: '/* ISTANBUL   IGNORE-NEXT */',
            filename: 'test.ts',
          },
          {
            code: '// deno-lint-ignore no-explicit-any',
            filename: 'test.ts',
          },
        ],
        invalid: [],
      });
    });

    it('should fix comments that only look like directives but are not', () => {
      ruleTester.run('comment-style', rule, {
        valid: [],
        invalid: [
          {
            code: '// @ts-ignoreX this is not a real directive',
            filename: 'test.ts',
            errors: [{ messageId: 'useMultiLineForText' }],
            output: '/* @ts-ignoreX this is not a real directive */',
          },
          {
            code: '// eslint-wtf should be fixed',
            filename: 'test.ts',
            errors: [{ messageId: 'useMultiLineForText' }],
            output: '/* eslint-wtf should be fixed */',
          },
          {
            code: '// istanbul-ignoreer not a directive',
            filename: 'test.ts',
            errors: [{ messageId: 'useMultiLineForText' }],
            output: '/* istanbul-ignoreer not a directive */',
          },
        ],
      });
    });

    it('edge-case: unicode whitespace and template strings', () => {
      ruleTester.run('comment-style', rule, {
        valid: [
          {
            // Using a NBSP (U+00A0) before a directive should still be considered a directive
            code: '//\u00A0@ts-ignore use NBSP before directive',
            filename: 'test.ts',
          },
          {
            // Template literal containing comment-like content should not be interpreted as comments
            code: 'const tpl = `/* not a comment */\n// not a comment inside string`;',
            filename: 'test.ts',
          },
          {
            // A multi-line block that contains a directive and explanatory text should remain a block
            code: `/*\n * prettier-ignore\n * Keep this block as documentation and directive together\n */`,
            filename: 'test.ts',
          },
        ],
        invalid: [],
      });
    });

    it('should treat single identifiers as text, not code', () => {
      ruleTester.run('comment-style', rule, {
        valid: [
          {
            // Single word identifiers should be treated as section labels/text
            code: '/* Electron */',
            filename: 'test.ts',
          },
          {
            code: '/* TODO */',
            filename: 'test.ts',
          },
          {
            code: '/* Button */',
            filename: 'test.ts',
          },
          {
            code: '/* Component */',
            filename: 'test.ts',
          },
          {
            code: '/* API */',
            filename: 'test.ts',
          },
        ],
        invalid: [
          {
            // Single identifiers in single-line comments should be converted to multi-line
            code: '// Electron',
            filename: 'test.ts',
            errors: [{ messageId: 'useMultiLineForText' }],
            output: '/* Electron */',
          },
          {
            code: '// TODO',
            filename: 'test.ts',
            errors: [{ messageId: 'useMultiLineForText' }],
            output: '/* TODO */',
          },
        ],
      });
    });
  });

  describe('plugin configuration', () => {
    it('should have correct metadata', () => {
      expect(plugin.meta?.name).toBe('eslint-plugin-consistent-comments');
      expect(plugin.meta?.version).toBe('1.2.0');
    });

    it('should have comment-style rule', () => {
      expect(plugin.rules).toHaveProperty('comment-style');
    });

    it('should have recommended config', () => {
      expect(plugin.configs).toHaveProperty('recommended');
      const recommended = plugin.configs?.recommended as {
        rules?: Record<string, unknown>;
      };
      expect(recommended?.rules).toHaveProperty('comments/comment-style');
    });
  });
});
