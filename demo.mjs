import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* Import the plugin */
const plugin = await import('./dist/index.mjs');

/* Create ESLint instance */
const eslint = new ESLint({
  overrideConfigFile: true,
  baseConfig: {
    files: ['**/*.ts', '**/*.js'],
    plugins: {
      comments: plugin.default,
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
  fix: process.argv.includes('--fix'),
});

/* Lint the example file */
const results = await eslint.lintFiles([
  join(__dirname, 'examples/before-fix.ts'),
]);

/* Format results */
const formatter = await eslint.loadFormatter('stylish');
const resultText = formatter.format(results);

console.log(resultText);

/* Show summary */
const errorCount = results.reduce((sum, r) => sum + r.errorCount, 0);
const warningCount = results.reduce((sum, r) => sum + r.warningCount, 0);
const fixableErrorCount = results.reduce(
  (sum, r) => sum + r.fixableErrorCount,
  0,
);

console.log('\n📊 Summary:');
console.log(`   Errors: ${errorCount}`);
console.log(`   Warnings: ${warningCount}`);
console.log(`   Fixable: ${fixableErrorCount}`);

if (fixableErrorCount > 0 && !process.argv.includes('--fix')) {
  console.log('\n💡 Tip: Run with --fix to automatically fix these issues');
}

if (process.argv.includes('--fix')) {
  await ESLint.outputFixes(results);
  console.log('\n✅ Fixed issues have been applied!');
}
