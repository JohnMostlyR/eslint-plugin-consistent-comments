import commentsPluginDefault from './dist/index.mjs';

/** @type {any} */
const commentsPlugin = commentsPluginDefault;

/**
 * Example ESLint configuration using the comments plugin
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: {
      comments: commentsPlugin,
    },
    rules: {
      'comments/comment-style': 'error',
    },
  },
];
