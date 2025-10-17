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
  });

  describe('plugin configuration', () => {
    it('should have correct metadata', () => {
      expect(plugin.meta?.name).toBe('eslint-plugin-consistent-comments');
      expect(plugin.meta?.version).toBe('1.0.0');
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
