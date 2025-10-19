import type { ESLint, Rule } from 'eslint';
import * as espree from 'espree';

/**
 * Detects if a comment contains code by attempting to parse it as JavaScript/TypeScript.
 *
 * This function uses AST parsing instead of regex patterns to accurately determine
 * if a comment contains valid code. This approach handles edge cases that regex
 * patterns might miss, such as:
 * - Text that looks like code but has invalid syntax (e.g., "const x = incomplete")
 * - Valid expressions (e.g., "true", "42", "{ key: 'value' }")
 * - Complex code patterns (e.g., arrow functions, object/array literals)
 *
 * Strategy:
 * 1. First, try parsing as a complete program
 * 2. If that fails, try parsing as an expression (wrapped in parentheses)
 * 3. If that fails, try parsing as a statement (wrapped in a function)
 * 4. If all parsing attempts fail, it's considered text, not code
 *
 * @param text - The comment text to analyze
 * @returns true if the comment appears to contain valid code
 */
function isCommentedCode(text: string): boolean {
  const trimmed = text.trim();

  /* Empty comments are not code */
  if (!trimmed) return false;

  /* Try to parse the uncommented text as JavaScript code */
  try {
    /* Use the same parser options as the current file */
    const parserOptions: espree.Options = {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
        globalReturn: false,
      },
    };

    /* Attempt to parse as a complete program */
    espree.parse(trimmed, parserOptions);
    return true;
  } catch (programError) {
    /* If it fails as a program, try parsing as an expression */
    try {
      const parserOptions: espree.Options = {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
          globalReturn: false,
        },
      };

      /* Wrap in parentheses to try as expression */
      espree.parse(`(${trimmed})`, parserOptions);
      return true;
    } catch (expressionError) {
      /* Also try common statement patterns that might not parse standalone */
      try {
        /* Try wrapping in a function to see if it's a valid statement */
        espree.parse(`function _test() { ${trimmed} }`, {
          ecmaVersion: 'latest',
          sourceType: 'module',
        });
        return true;
      } catch {
        /* Not valid code in any form */
        return false;
      }
    }
  }
}

/**
 * Rule: enforce comment style based on content
 * - Commented-out code should use single-line comments
 * - Regular comments should use multi-line comments
 */
const commentStyleRule: Rule.RuleModule = {
  meta: {
    type: 'layout',
    docs: {
      description:
        'Enforce single-line comments for code, multi-line comments for documentation',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      useSlashForCode:
        'Commented-out code should use single-line comments (//) instead of multi-line comments (/* */)',
      useMultiLineForText:
        'Non-code comments should use multi-line comments (/* */) instead of single-line comments (//)',
    },
  },

  create(context: Rule.RuleContext): Rule.RuleListener {
    const sourceCode = context.sourceCode;

    return {
      Program(): void {
        const comments = sourceCode.getAllComments();

        for (const comment of comments) {
          const commentText = comment.value;
          const raw =
            comment.range &&
            sourceCode.text.slice(comment.range[0], comment.range[1]);

          /*
           * Don't touch triple-slash directives (e.g. /// <reference ... />)
           * or directive-like comments such as @ts-ignore, eslint-disable,
           * prettier-ignore, istanbul ignore, etc.
           */
          const trimmedRaw = raw ? raw.trimStart() : '';

          if (trimmedRaw.startsWith('///')) continue;

          /*
           * Detect directive-like comments in both line (// ...) and block (slash-star ... star-slash)
           * forms. The regex matches common directive prefixes used by TypeScript, ESLint,
           * Prettier, Istanbul/coverage tools, Deno, TSLint, and similar. It allows optional
           * spacing and is case-insensitive.
           */
          const directiveBody =
            '(?:@ts-ignore\\b|@ts-expect-error\\b|ts-?nocheck\\b|tslint:|eslint(?:-(?:disable|enable)(?:-next-line|-line)?)?\\b|eslint-?env\\b|prettier-ignore\\b|istanbul(?:\\s+ignore(?:[-\\s]next|\\b))?\\b|deno-lint-ignore\\b)';

          const lineDirectiveRe = new RegExp(
            '^\\/\\/\\s*' + directiveBody,
            'i',
          );
          const blockDirectiveRe = new RegExp(
            '^\\/\\*+\\s*' + directiveBody,
            'i',
          );

          if (
            lineDirectiveRe.test(trimmedRaw) ||
            blockDirectiveRe.test(trimmedRaw)
          )
            continue;

          const isCode = isCommentedCode(commentText);

          if (comment.type === 'Block' && isCode) {
            /* Multi-line comment containing code - should be single-line */
            context.report({
              loc: comment.loc!,
              messageId: 'useSlashForCode',
              fix(fixer) {
                const lines = commentText.split('\n');
                const startLine = comment.loc!.start.line;

                /* Get indentation from the first line */
                const sourceLines = sourceCode.lines;
                const commentLineIndex = startLine - 1;
                const commentLine = sourceLines[commentLineIndex] || '';
                const match = /^(\s*)/.exec(commentLine);
                const baseIndent = match ? match[1] : '';

                /* Convert multi-line block comment to single-line comments */
                const replacement = lines
                  .map((line, index) => {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) return '';
                    const indent = index === 0 ? '' : baseIndent;
                    return `${indent}// ${trimmedLine}`;
                  })
                  .filter((line) => line)
                  .join('\n');

                return fixer.replaceTextRange(
                  [comment.range![0], comment.range![1]],
                  replacement,
                );
              },
            });
          } else if (comment.type === 'Line' && !isCode) {
            /* Single-line comment with non-code text - should be multi-line */
            context.report({
              loc: comment.loc!,
              messageId: 'useMultiLineForText',
              fix(fixer) {
                const text = commentText.trim();
                const replacement = `/* ${text} */`;

                return fixer.replaceTextRange(
                  [comment.range![0], comment.range![1]],
                  replacement,
                );
              },
            });
          }
        }
      },
    };
  },
};

const plugin: ESLint.Plugin = {
  meta: {
    name: 'eslint-plugin-consistent-comments',
    version: '1.1.0',
  },
  configs: {
    recommended: {
      rules: {
        'comments/comment-style': 'error',
      },
    },
  },
  rules: {
    'comment-style': commentStyleRule,
  },
};

export default plugin;
