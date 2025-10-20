import { writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inspect } from 'node:util';
import { ESLint } from 'eslint';
import { glob } from 'glob';
import tseslint from 'typescript-eslint';

import plugin from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const inputDir = join(__dirname, 'input');
const outputDir = join(__dirname, 'output');

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

const files = await glob('**/*.{js,ts}', {
  absolute: true,
  cwd: inputDir,
  ignore: 'node_modules/**',
});
console.info('');
console.debug('📚 Files:', inspect(files, { depth: null, colors: true }));

const results = await eslint.lintFiles(files);
console.info('');
console.debug('📄 Results:', inspect(results, { depth: null, colors: true }));

for (const result of results) {
  const fileName = basename(result.filePath);
  const outputPath = join(outputDir, fileName);

  console.info('');
  console.debug('📝 Writing output file:', outputPath);
  await writeFile(outputPath, result.output ?? '');
}

console.info('');
console.info('✅ Debugging completed.\n');
