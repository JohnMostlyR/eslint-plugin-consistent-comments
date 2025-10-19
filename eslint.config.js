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
  sonarjs.configs.recommended,
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
    },
    rules: {
      'comments/comment-style': 'error',
    },
  },
];

export default config;
