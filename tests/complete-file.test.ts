import { readFile } from 'node:fs/promises';
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
    it('should correctly lint the case-one file', async () => {
      expect.assertions(1);

      const filePathToTest = join(fixturesDir, 'case-one.ts');
      const filePathToFixed = join(fixturesDir, 'case-one-fixed.ts');

      const results = await eslint.lintFiles([filePathToTest]);

      await expect(results[0]!.output).toMatchFileSnapshot(filePathToFixed);
    });

    it('should correctly lint the edge-case file', async () => {
      expect.assertions(1);

      const filePathToTest = join(fixturesDir, 'edge-case.ts');
      const filePathToFixed = join(fixturesDir, 'edge-case-fixed.ts');

      const results = await eslint.lintFiles([filePathToTest]);

      await expect(results[0]!.output).toMatchFileSnapshot(filePathToFixed);
    });

    it('should correctly lint the multi-line-block-cases file', async () => {
      expect.assertions(1);

      const filePathToTest = join(fixturesDir, 'multi-line-block-cases.ts');
      const filePathToFixed = join(
        fixturesDir,
        'multi-line-block-cases-fixed.ts',
      );

      const results = await eslint.lintFiles([filePathToTest]);

      await expect(results[0]!.output).toMatchFileSnapshot(filePathToFixed);
    });

    it('should correctly lint the triple-slash file', async () => {
      expect.assertions(1);

      const filePathToTest = join(fixturesDir, 'triple-slash.ts');
      const filePathToFixed = join(fixturesDir, 'triple-slash-fixed.ts');

      const results = await eslint.lintFiles([filePathToTest]);

      // If no fixes were applied, output will be undefined, so read the original file
      const actualOutput =
        results[0]!.output ?? (await readFile(filePathToTest, 'utf-8'));

      await expect(actualOutput).toMatchFileSnapshot(filePathToFixed);
    });

    it('should correctly lint the code-detection file', async () => {
      expect.assertions(1);

      const filePathToTest = join(fixturesDir, 'code-detection.ts');
      const filePathToFixed = join(fixturesDir, 'code-detection-fixed.ts');

      const results = await eslint.lintFiles([filePathToTest]);

      await expect(results[0]!.output).toMatchFileSnapshot(filePathToFixed);
    });

    it('should correctly lint the directives file', async () => {
      expect.assertions(1);

      const filePathToTest = join(fixturesDir, 'directives.ts');
      const filePathToFixed = join(fixturesDir, 'directives-fixed.ts');

      const results = await eslint.lintFiles([filePathToTest]);

      await expect(results[0]!.output).toMatchFileSnapshot(filePathToFixed);
    });

    it('should correctly lint the consecutive-comments file', async () => {
      expect.assertions(1);

      const filePathToTest = join(fixturesDir, 'consecutive-comments.ts');
      const filePathToFixed = join(
        fixturesDir,
        'consecutive-comments-fixed.ts',
      );

      const results = await eslint.lintFiles([filePathToTest]);

      await expect(results[0]!.output).toMatchFileSnapshot(filePathToFixed);
    });

    it('should correctly lint the mixed-scenarios file', async () => {
      expect.assertions(1);

      const filePathToTest = join(fixturesDir, 'mixed-scenarios.ts');
      const filePathToFixed = join(fixturesDir, 'mixed-scenarios-fixed.ts');

      const results = await eslint.lintFiles([filePathToTest]);

      await expect(results[0]!.output).toMatchFileSnapshot(filePathToFixed);
    });
  });
});
