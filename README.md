# eslint-plugin-consistent-comments

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/eslint-plugin-consistent-comments.svg)](https://www.npmjs.com/package/eslint-plugin-consistent-comments)

> Enforce consistent comment styles: single-line (`//`) for code, multi-line (`/* */`) for documentation

An ESLint plugin that automatically detects and enforces the appropriate comment style based on content. Commented-out code uses `//`, while documentation and explanatory text use `/* */`.

## 🤔 Why?

I want to have a clear distinction between commented-out code and documentation.

Commented-out code should probably be removed from production code, while documentation should stay.

## ✨ Features

- 🤖 **Smart Detection** - Automatically identifies code vs. documentation in comments using AST parsing
- 🔧 **Auto-fix** - Converts comments to the correct style with `eslint --fix`
- 📝 **Smart Merging** - Consecutive single-line text comments are merged into multi-line block format
- 🛡️ **Safe Conversion** - Avoids breaking comments that contain `*/` in their text
- 📦 **ESLint 9.x** - Compatible with modern flat config format
- 🎯 **TypeScript & JavaScript** - Works with both languages
- ⚡ **Zero Config** - Works out of the box with sensible defaults

## 📥 Installation

```bash
npm install eslint-plugin-consistent-comments --save-dev
```

Or using your preferred package manager:

```bash
pnpm add -D eslint-plugin-consistent-comments
# or
yarn add -D eslint-plugin-consistent-comments
```

## 🚀 Quick Start

Add to your `eslint.config.js`:

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

Then run ESLint with auto-fix:

```bash
npx eslint . --fix
```

## 📖 Usage

### The Problem

Inconsistent comment styles make code harder to read:

```typescript
/* const oldCode = 'should be single-line'; */ // ❌ Code in multi-line
// This explains the function below              // ❌ Text in single-line
```

### The Solution

This plugin enforces:

```typescript
// const oldCode = 'should be single-line';    // ✅ Code in single-line
/* This explains the function below */ // ✅ Text in multi-line
```

### Consecutive Comment Merging

When multiple single-line text comments appear consecutively (without empty lines), they're automatically merged into a multi-line block comment:

**Before:**

```typescript
// This is a documentation comment
// that spans multiple lines
// for better readability
```

**After:**

```typescript
/*
 * This is a documentation comment
 * that spans multiple lines
 * for better readability
 */
```

### What Gets Detected as Code?

The plugin uses **AST (Abstract Syntax Tree) parsing** to accurately detect code, not just regex patterns. It recognizes:

- **Declarations**: `const`, `let`, `var`, `function`, `class`, `interface`, `type`, `enum`
- **Control Flow**: `if`, `else`, `for`, `while`, `switch`, `return`, `throw`
- **Functions**: `function foo()`, `() => {}`, arrow functions
- **Imports/Exports**: `import`, `export`
- **Method Calls**: `obj.method()`, `foo()`
- **Operators**: Assignments, comparisons
- **Data Structures**: Arrays `[...]`, objects `{...}`
- **Type Annotations**: `: string`, `: number`
- **JSX**: `<Component />`
- **Expressions**: `true`, `42`, `"string"`, object/array literals

### Special Cases & Safety

The plugin intelligently handles edge cases:

#### Comments containing `*/`

Comments that contain `*/` in their text are **not converted** to multi-line format to avoid breaking syntax:

```typescript
// These should NOT be converted to /* */ (results in invalid code)
// ✅ Stays as single-line comment to prevent syntax errors
```

#### Triple-slash directives

TypeScript directives and special comment forms are preserved:

```typescript
/// <reference types="node" />           // ✅ Not converted
// @ts-ignore: special case              // ✅ Not converted
// eslint-disable-next-line no-unused-vars // ✅ Not converted
```

## 📋 Examples

### Before Auto-fix

```typescript
/* const x = 5; */
/* function test() { return true; } */
// This is a documentation comment
// that spans multiple lines

/*
  const multiple = 'lines';
  const of = 'code';
*/
```

### After Auto-fix

```typescript
// const x = 5;
// function test() { return true; }
/*
 * This is a documentation comment
 * that spans multiple lines
 */

// const multiple = 'lines';
// const of = 'code';
```

## ⚙️ Configuration

### Use Recommended Config

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

### With Other Plugins

```javascript
import commentsPlugin from 'eslint-plugin-consistent-comments';
import tseslint from 'typescript-eslint';

export default [
  ...tseslint.configs.recommended,
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

### Rule Options

Currently, the rule has no options and works with sensible defaults. Future versions may add configuration options.

## 🧪 Testing

Clone this repository, install dependencies, and run tests:

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests with coverage
pnpm run coverage

# Build the plugin
pnpm build
```

Try the demo:

```bash
# Check for violations
node demo.mjs

# Auto-fix violations
node demo.mjs --fix
```

## 🏗️ Development

### Project Structure

```
src/
  index.ts              # Main plugin implementation
tests/
  index.test.ts         # Test suite
  fixtures/             # Test fixtures
examples/
  before-fix.ts         # Example with violations
  after-fix.ts          # Example after fixes
  integration-example.ts # Comprehensive examples
```

### Package Scripts

- `pnpm build` — Build with unbuild (outputs CJS/ESM and type declarations)
- `pnpm test` — Run tests with Vitest
- `pnpm test:watch` — Run tests in watch mode
- `pnpm coverage` — Generate coverage reports
- `pnpm lint` — Run ESLint and auto-fix issues
- `pnpm typecheck` — Run TypeScript type checks

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT © [Johan Meester](https://github.com/JohnMostlyR)

## 🔗 Related Projects

- [ESLint](https://eslint.org/) - Pluggable JavaScript linter
- [typescript-eslint](https://typescript-eslint.io/) - TypeScript support for ESLint

## 🎯 How It Works

The plugin uses a sophisticated approach to distinguish between code and text:

1. **AST Parsing**: Uses `espree` (ESLint's parser) to attempt parsing comment content as JavaScript/TypeScript
2. **Multiple Parse Attempts**: Tries parsing as:
   - Complete program (statements)
   - Expression (wrapped in parentheses)
   - Statement (wrapped in a function body)
3. **Accurate Detection**: If the content parses successfully, it's code; otherwise, it's text
4. **Consecutive Grouping**: Merges consecutive single-line text comments into multi-line blocks
5. **Safety First**: Skips conversion when it would create invalid syntax

This approach is far more reliable than regex patterns and handles edge cases like:

- `/* true */` → `// true` (valid code, single boolean value)
- `/* This is true */` → stays as `/* This is true */` (text, not code)

## 💡 Inspiration

This plugin was created to enforce a consistent commenting style that makes it easier to:

- Distinguish between commented-out code (temporary, should be reviewed/removed)
- Documentation comments (permanent, explains intent)
- Keep documentation organized in proper multi-line block format

## 📚 Further Reading

For more detailed documentation, see:

- [USAGE.md](./USAGE.md) - Comprehensive usage guide
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Project summary and implementation details

---

**Made with ❤️ for better code consistency**
