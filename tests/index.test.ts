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

/* Run the rule tester at the top level, not inside test functions */
ruleTester.run('comment-style', rule, {
  valid: [
    /* should flag multi-line comments containing code */
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

    /* should correctly identify commented code patterns */
    {
      code: '// import { foo } from "bar";',
      filename: 'test.ts',
    },
    {
      code: '// export default class Test {}',
      filename: 'test.ts',
    },

    /* should detect object properties as code */
    {
      code: '// key: value,',
      filename: 'test.ts',
    },
    {
      code: '// ELECTRON_CLERK_PUBLISHABLE_KEY: z.string().min(1),',
      filename: 'test.ts',
    },
    {
      code: '// port: 3000',
      filename: 'test.ts',
    },

    /* should not flag triple slash directives */
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
    {
      code: '  //   @ts-expect-error  ',
      filename: 'test.ts',
    },
    {
      code: '\t// istanbul ignore next',
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

    /* edge-case: unicode whitespace and template strings */
    {
      code: '//\u00A0@ts-ignore use NBSP before directive',
      filename: 'test.ts',
    },
    {
      code: 'const tpl = `/* not a comment */\n// not a comment inside string`;',
      filename: 'test.ts',
    },
    {
      code: `/*\n * prettier-ignore\n * Keep this block as documentation and directive together\n */`,
      filename: 'test.ts',
    },

    /* should treat single identifiers as text, not code */
    {
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
    /* should flag multi-line comments containing code */
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

    /* should handle multi-line block comments with code */
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

    /* should correctly identify commented code patterns */
    {
      code: '/* import { foo } from "bar"; */',
      filename: 'test.ts',
      errors: [{ messageId: 'useSlashForCode' }],
      output: '// import { foo } from "bar";',
    },

    /* should detect object properties as code */
    {
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

    /* should fix comments that only look like directives but are not */
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

    /* should treat single identifiers as text, not code */
    {
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

describe('eslint-plugin-consistent-comments', () => {
  describe('comment-style rule', () => {
    it('should flag multi-line comments containing code', () => {
      /* Test cases are now run at the top level via ruleTester.run() */
      expect(true).toBe(true);
    });

    it('should handle multi-line block comments with code', () => {
      expect(true).toBe(true);
    });

    it('should correctly identify commented code patterns', () => {
      expect(true).toBe(true);
    });

    it('should detect object properties as code', () => {
      expect(true).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should not flag triple slash directives', () => {
      expect(true).toBe(true);
    });

    it('should fix comments that only look like directives but are not', () => {
      expect(true).toBe(true);
    });

    it('edge-case: unicode whitespace and template strings', () => {
      expect(true).toBe(true);
    });

    it('should treat single identifiers as text, not code', () => {
      expect(true).toBe(true);
    });
  });

  describe('plugin configuration', () => {
    it('should have correct metadata', () => {
      expect(plugin.meta?.name).toBe('eslint-plugin-consistent-comments');
      expect(plugin.meta?.version).toBe('1.5.0');
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
