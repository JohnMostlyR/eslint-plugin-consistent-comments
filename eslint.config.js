import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import sonarjs from 'eslint-plugin-sonarjs';
import tseslint from 'typescript-eslint';

import commentsPlugin from './dist/index.mjs';

const GITIGNORE_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '.gitignore',
);

/**
 * @type {import('eslint').Linter.Config[]}
 */
export const config = [
  includeIgnoreFile(GITIGNORE_PATH),
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        parser: tseslint.parser,
        projectService: false,
        sourceType: 'module',
      },
    },
    plugins: {
      comments: commentsPlugin,
      sonarjs,
    },
    rules: {
      'comments/comment-style': 'error',
    },
  },
  {
    name: 'typescript',
    files: ['src/**/*.ts'],
  },
  {
    name: 'tests',

    files: ['tests/*.ts'],
    ignores: ['tests/fixtures/**'],
    rules: {
      'sonarjs/no-empty-group': 'off',
      'sonarjs/no-nested-functions': 'off',
    },
  },
];

export default config;
