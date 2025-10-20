import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';
import tseslint from 'typescript-eslint';
import { describe, expect, it } from 'vitest';

import plugin from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fixturesDir = join(__dirname, 'fixtures');

const eslint = new ESLint({
  overrideConfigFile: true,
  baseConfig: {
    files: ['**/*.ts', '**/*.js'],
    plugins: {
      comments: plugin,
    },
    rules: {
      'comments/comment-style': 'error',
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        projectService: false,
      },
    },
  },
  fix: true,
});

describe('eslint-plugin-consistent-comments', () => {
  describe('auto-fix', () => {
    it('should lint the case-one file', async () => {
      expect.assertions(1);

      const filePathToTest = join(fixturesDir, 'case-one.ts');
      const filePathToFixed = join(fixturesDir, 'case-one-fixed.ts');

      const results = await eslint.lintFiles([filePathToTest]);

      await expect(results[0]!.output).toMatchFileSnapshot(filePathToFixed);
    });

    it('should lint the edge-case file', async () => {
      expect.assertions(1);

      const filePathToTest = join(fixturesDir, 'edge-case.ts');
      const filePathToFixed = join(fixturesDir, 'edge-case-fixed.ts');

      const results = await eslint.lintFiles([filePathToTest]);

      await expect(results[0]!.output).toMatchFileSnapshot(filePathToFixed);
    });
  });
});
