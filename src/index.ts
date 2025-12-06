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
 * 1. First, check if it's JSDoc documentation
 * 2. Check for TypeScript-specific syntax patterns
 * 3. Try parsing as a complete program
 * 4. If successful, check if it's just a single identifier (which is text, not code)
 * 5. If that fails, try parsing as an expression (wrapped in parentheses)
 * 6. If that fails, try parsing as an object property (wrapped in object literal)
 * 7. If that fails, try parsing as a statement (wrapped in a function)
 * 8. If all parsing attempts fail, it's considered text, not code
 *
 * @param text - The comment text to analyze
 * @returns true if the comment appears to contain valid code
 */
function isCommentedCode(text: string): boolean {
  const trimmed = text.trim();

  /* Empty comments are not code */
  if (!trimmed) return false;

  /*
   * Check if this is JSDoc documentation (contains @ tags like @param, @returns, etc.)
   * JSDoc comments are documentation, not commented-out code.
   * We check for common JSDoc patterns that indicate this is documentation.
   */
  const jsdocIndicators = [
    /\*\s*@\w+/, // Multi-line JSDoc: * @param, * @returns, etc.
    /@param\s*\{/, // @param with type annotation
    /@returns?\s*\{/, // @returns with type annotation
    /@(throws|author|copyright|deprecated|since|example|see|link|name|module|namespace|description|summary)\b/, // Other common JSDoc tags
  ];

  if (jsdocIndicators.some((pattern) => pattern.test(trimmed))) {
    return false;
  }

  /*
   * Check for TypeScript-specific syntax patterns that won't parse with espree.
   * These patterns indicate commented-out TypeScript code:
   * - Generic type syntax: Array<T>, Map<K, V>, etc.
   * - Type annotations: variableName: Type
   * - Interface/type property definitions: propertyName: Type;
   * - Type keywords: interface, type, enum, namespace, declare
   */
  const typeScriptPatterns = [
    /\w+<[\w\s,\[\]]+>/, // Generic types: Array<string>, Map<K, V>
    /\w+:\s*\w+<[\w\s,\[\]]+>/, // Properties with generic types: prop: Array<number>
    /^\s*(interface|type|enum|namespace|declare)\s+\w+/, // Type keywords at start
    /:\s*(string|number|boolean|any|unknown|never|void|object)\s*[;,\)\}]/, // Type annotations
    /:\s*\w+\[\]\s*[;,\)\}]/, // Array type syntax: Type[]
  ];

  if (typeScriptPatterns.some((pattern) => pattern.test(trimmed))) {
    return true;
  }

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
    const ast = espree.parse(trimmed, parserOptions);

    /*
     * If the parsed program is just a single identifier (e.g., "Electron", "TODO"),
     * treat it as text rather than code. Single identifiers are typically section
     * labels or category headers, not commented-out code.
     */
    if (
      ast.body.length === 1 &&
      ast.body[0]?.type === 'ExpressionStatement' &&
      ast.body[0].expression.type === 'Identifier'
    ) {
      return false;
    }

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
      /* Try parsing as an object property (handles cases like "key: value,") */
      try {
        espree.parse(`({${trimmed}})`, {
          ecmaVersion: 'latest',
          sourceType: 'module',
        });
        return true;
      } catch (objectError) {
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
        const processedComments = new Set<(typeof comments)[number]>();

        for (let i = 0; i < comments.length; i++) {
          const comment = comments[i];

          if (!comment || processedComments.has(comment)) {
            continue;
          }

          const commentText = comment.value;
          const isCode = isCommentedCode(commentText);

          if (comment.type === 'Block' && isCode) {
            /* Multi-line comment containing code - should be single-line */
            context.report({
              loc: comment.loc!,
              messageId: 'useSlashForCode',
              fix(fixer) {
                const lines = commentText.split('\n');
                const startLine = comment.loc!.start.line;

                /* Get indentation from the first comment */
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
            const text = commentText.trim();

            // Skip conversion if the comment contains */ which would break multi-line syntax
            if (text.includes('*/')) {
              continue;
            }

            // Skip triple-slash directives (e.g., /// <reference types="..." />)
            // These are TypeScript compiler directives that must remain as ///
            if (commentText.startsWith('/')) {
              continue;
            }

            /* Check for consecutive single-line comments */
            const consecutiveComments = [comment];
            processedComments.add(comment);

            for (let j = i + 1; j < comments.length; j++) {
              const nextComment = comments[j];

              if (!nextComment || nextComment.type !== 'Line') {
                break;
              }

              const nextIsCode = isCommentedCode(nextComment.value);
              if (nextIsCode) {
                break;
              }

              // Check if the next comment contains */ which would break multi-line syntax
              if (nextComment.value.trim().includes('*/')) {
                break;
              }

              /* Check if comments are on consecutive lines (no empty lines between) */
              const lastConsecutive =
                consecutiveComments[consecutiveComments.length - 1];
              if (!lastConsecutive) break;

              const currentLine = lastConsecutive.loc!.end.line;
              const nextLine = nextComment.loc!.start.line;

              if (nextLine === currentLine + 1) {
                consecutiveComments.push(nextComment);
                processedComments.add(nextComment);
              } else {
                break;
              }
            }

            /* If we have multiple consecutive comments, merge them into a block comment */
            if (consecutiveComments.length > 1) {
              const firstComment = consecutiveComments[0];
              const lastComment =
                consecutiveComments[consecutiveComments.length - 1];

              if (!firstComment || !lastComment) continue;

              /* Get indentation from the first comment */
              const sourceLines = sourceCode.lines;
              const commentLineIndex = firstComment.loc!.start.line - 1;
              const commentLine = sourceLines[commentLineIndex] || '';
              const match = /^(\s*)/.exec(commentLine);
              const baseIndent = match ? match[1] : '';

              context.report({
                loc: {
                  start: firstComment.loc!.start,
                  end: lastComment.loc!.end,
                },
                messageId: 'useMultiLineForText',
                fix(fixer) {
                  const lines = consecutiveComments
                    .map((c) => c?.value.trim() || '')
                    .filter((l) => l);
                  const blockLines = [
                    '/*',
                    ...lines.map((line) => ` * ${line}`),
                    ' */',
                  ];
                  const replacement = blockLines.join(`\n${baseIndent}`);

                  return fixer.replaceTextRange(
                    [firstComment.range![0], lastComment.range![1]],
                    replacement,
                  );
                },
              });
            } else {
              /* Single comment - convert to single-line block comment */
              context.report({
                loc: comment.loc!,
                messageId: 'useMultiLineForText',
                fix(fixer) {
                  const replacement = `/* ${text} */`;

                  return fixer.replaceTextRange(
                    [comment.range![0], comment.range![1]],
                    replacement,
                  );
                },
              });
            }
          }
        }
      },
    };
  },
};

const plugin: ESLint.Plugin = {
  meta: {
    name: 'eslint-plugin-consistent-comments',
    version: '1.4.1',
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
