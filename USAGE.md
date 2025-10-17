# ESLint Plugin Consistent Comments

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Coverage Status](https://img.shields.io/badge/coverage-reports-green)](./reports/coverage/index.html)

An ESLint 9.x plugin that enforces consistent comment styles based on content:

- **Commented-out code** should use single-line comments (`//`)
- **Documentation/text comments** should use multi-line comments (`/* */`)

## Features

- ✅ Automatically detects commented-out code vs. documentation
- 🔧 Auto-fix support to convert between comment styles
- 🎯 Works with JavaScript and TypeScript
- 📦 Compatible with ESLint 9.x flat config

## Installation

```bash
npm install eslint-plugin-consistent-comments --save-dev
# or
pnpm add -D eslint-plugin-consistent-comments
# or
yarn add -D eslint-plugin-consistent-comments
```

## Usage

### ESLint Flat Config (eslint.config.js)

```javascript
import commentsPlugin from 'eslint-plugin-consistent-comments';

export default [
  {
    plugins: {
      comments: commentsPlugin,
    },
    rules: {
      'comments/comment-style': 'error',
    },
  },
];
```

Or use the recommended config:

```javascript
import commentsPlugin from 'eslint-plugin-consistent-comments';

export default [
  {
    plugins: {
      comments: commentsPlugin,
    },
    rules: {
      ...commentsPlugin.configs.recommended.rules,
    },
  },
];
```

## Rule: `comment-style`

This rule enforces that:

1. Comments containing code use single-line syntax (`//`)
2. Comments containing documentation/text use multi-line syntax (`/* */`)

### Examples

#### ❌ Incorrect

```typescript
/* const x = 5; */ // Code in multi-line comment
/* function test() { return true; } */ // Code in multi-line comment

// This is a documentation comment  // Text in single-line comment
```

#### ✅ Correct

```typescript
// const x = 5;  // Code in single-line comment
// function test() { return true; }  // Code in single-line comment

/* This is a documentation comment */ // Text in multi-line comment
```

### Code Detection

The rule detects commented-out code by looking for patterns like:

- Variable declarations: `const`, `let`, `var`
- Function declarations: `function`, arrow functions (`=>`)
- Control flow: `if`, `for`, `while`, `switch`, `return`
- Imports/exports: `import`, `export`
- Method calls and chains
- Assignment operators
- Array/object literals
- Type annotations
- JSX elements

### Auto-fix

The rule includes an auto-fixer that will:

- Convert multi-line comments with code to single-line comments
- Convert single-line comments with text to multi-line comments
- Preserve indentation for multi-line conversions

Run ESLint with the `--fix` flag to automatically fix violations:

```bash
eslint --fix .
```

## Examples

### Before

```typescript
/* This is a regular comment explaining the code below */
const greeting = 'Hello, World!';

// This is also a documentation comment
const name = 'John';

/* const oldCode = 'this should be flagged'; */
/* function oldFunction() { return true; } */

// if (condition) { doSomething(); }
```

### After (with auto-fix)

```typescript
/* This is a regular comment explaining the code below */
const greeting = 'Hello, World!';

/* This is also a documentation comment */
const name = 'John';

// const oldCode = 'this should be flagged';
// function oldFunction() { return true; }

// if (condition) { doSomething(); }
```

## Testing the Plugin

See the test fixtures in `tests/fixtures/` for examples of code before and after applying the rule.

You can test the plugin by running:

```bash
pnpm test
```

## Development

```bash
# Install dependencies
pnpm install

# Build the plugin
pnpm run build

# Run tests
pnpm test

# Run tests with coverage
pnpm run coverage

# Lint
pnpm run lint
```

## How It Works

The plugin analyzes comment content using pattern matching to determine if a comment contains code or documentation:

1. **Code Detection**: Uses regular expressions to identify common code patterns
2. **Style Enforcement**: Compares detected type with actual comment style
3. **Auto-fix**: Converts comments to the appropriate style while preserving formatting

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
