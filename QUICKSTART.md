# Quick Start Guide

## Installation

```bash
pnpm add -D eslint-plugin-consistent-comments
```

## Configuration

Create or update your `eslint.config.js`:

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

## Usage

### Check for issues

```bash
npx eslint .
```

### Auto-fix issues

```bash
npx eslint . --fix
```

## Example

### Before auto-fix:

```typescript
/* const x = 5; */  ❌ Code in multi-line comment
// This is documentation  ❌ Text in single-line comment
```

### After auto-fix:

```typescript
// const x = 5;  ✅ Code in single-line comment
/* This is documentation */  ✅ Text in multi-line comment
```

## What Gets Detected as Code?

- Variable declarations: `const`, `let`, `var`
- Functions: `function foo()`, `() => {}`
- Control flow: `if`, `for`, `while`, `return`
- Imports/exports: `import`, `export`
- Method calls: `foo()`, `obj.method()`
- Assignments: `x = 5`, `x += 1`
- Arrays/objects: `[1, 2, 3]`, `{ key: value }`
- Type annotations: `: string`, `: number`
- JSX: `<Component />`

## Integration with Existing Projects

This plugin works alongside your existing ESLint configuration:

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

## CI/CD Integration

Add to your CI pipeline:

```yaml
# .github/workflows/lint.yml
- name: Lint code
  run: |
    npm run lint
    npx eslint . --max-warnings 0
```
