# Debug Folder

This folder contains utilities for testing and debugging the `eslint-plugin-consistent-comments` plugin.

## 📁 Structure

```
debug/
├── test.ts       # Main debug script
├── input/        # Place test files here
├── output/       # Auto-fixed files appear here
└── README.md     # This file
```

## 🚀 Usage

### Quick Start

1. Place files you want to test in the `input/` folder
2. Run the debug script:

```bash
pnpm run debug
```

3. Check the auto-fixed output in the `output/` folder

### What It Does

The debug script:

- ✅ Scans all `.ts` and `.js` files in `input/`
- ✅ Runs the ESLint plugin on them
- ✅ Applies auto-fixes
- ✅ Writes the fixed output to `output/`
- ✅ Shows detailed results in the console

## 📝 Example Workflow

### 1. Create a test file

Create `input/my-test.ts`:

```typescript
/* const x = 5; */
// This is a documentation comment
// that spans multiple lines

/* function test() { return true; } */
```

### 2. Run the debug script

```bash
pnpm run debug
```

### 3. View the output

Check `output/my-test.ts`:

```typescript
// const x = 5;
/*
 * This is a documentation comment
 * that spans multiple lines
 */

// function test() { return true; }
```

## 🔍 Output Details

The debug script provides:

### Console Output

- 📚 **Files**: List of all files being processed
- 📄 **Results**: Detailed ESLint results including:
  - Number of errors/warnings
  - Specific rule violations
  - Line and column positions
  - Fixed content

### File Output

- Fixed files are written to `output/` with the same name as the input file
- Original files in `input/` remain unchanged

## 🛠️ Configuration

The debug script uses this ESLint configuration:

```typescript
{
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
  },
}
```

To modify the configuration, edit `test.ts`.

## 📊 Use Cases

### Test New Features

Add test files to `input/` to verify plugin behavior before writing formal tests.

### Debug Issues

When you encounter an issue:

1. Create a minimal reproduction in `input/`
2. Run `pnpm run debug`
3. Examine the output and console logs

### Validate Edge Cases

Test complex scenarios:

- Triple-slash directives
- Comments containing `*/`
- Nested code structures
- Mixed comment styles

### Before/After Comparisons

Keep files in `input/` and `output/` to:

- Document how the plugin transforms code
- Create examples for documentation
- Show expected behavior

## 🧪 Example Test Files

### Triple-slash directives (`input/triple-slash.ts`)

```typescript
/// <reference types="node" />

// Regular code comment
const x = 5;

/* Documentation comment */
function test() {}
```

### Code vs. Text (`input/mixed-comments.ts`)

```typescript
/* const commented = 'code'; */
// This is explanatory text
/* if (condition) { doSomething(); } */
// Another explanation
```

### Consecutive Comments (`input/consecutive.ts`)

```typescript
// First line of docs
// Second line of docs
// Third line of docs

// const code = 'stays single-line';
```

## 🔄 Workflow Tips

### Iterative Development

```bash
# 1. Edit input files
# 2. Run debug
pnpm run debug
# 3. Check output
# 4. Repeat
```

### Clean Output

To start fresh:

```bash
# Windows (PowerShell)
Remove-Item output/* -Force

# Linux/macOS
rm -f output/*
```

### Compare Results

Use a diff tool to compare input vs. output:

```bash
# Windows (PowerShell)
code --diff input/test.ts output/test.ts

# Linux/macOS
diff input/test.ts output/test.ts
```

## 🐛 Debugging

### Enable Verbose Logging

Modify `test.ts` to add more logging:

```typescript
console.debug('🔍 Processing file:', result.filePath);
console.debug('📊 Messages:', result.messages);
console.debug('💾 Output:', result.output);
```

### Check for Errors

If the script fails:

1. Verify files exist in `input/`
2. Check file syntax is valid
3. Look for console errors
4. Ensure dependencies are installed (`pnpm install`)

## 📚 Related

- See [../tests/](../tests/) for formal unit tests
- See [../examples/](../examples/) for usage examples
- See [../README.md](../README.md) for plugin documentation

## 💡 Tips

- Use descriptive filenames in `input/` (e.g., `edge-case-nested-blocks.ts`)
- Keep test files small and focused on specific scenarios
- Document expected behavior in comments within test files
- Commit interesting test cases to version control for regression testing

---

**Happy debugging! 🐛✨**
