import type { ESLint, Rule } from 'eslint';

/**
 * Detects if a comment contains code by checking for common code patterns
 * @param text - The comment text to analyze
 * @returns true if the comment appears to contain code
 */
function isCommentedCode(text: string): boolean {
  const trimmed = text.trim();

  /* Empty comments are not code */
  if (!trimmed) return false;

  /* Check for common code patterns */
  const codePatterns = [
    /* Variable declarations */
    /^(const|let|var|function|class|interface|type|enum)\s+/,

    /* Control flow */
    /^(if|else|for|while|do|switch|case|break|continue|return|throw|try|catch|finally)\s*[({]/,

    /* Function calls and method chains */
    /^[\w$.]+\s*\(/,
    /^[\w$.]+\s*\.\s*[\w$]+/,

    /* Assignment operators */
    /^[\w$.]+\s*[=+\-*/%&|^]=?\s*/,

    /* Array/object literals at start */
    /^[\[{]/,

    /* Arrow functions */
    /^\(.*\)\s*=>/,
    /^[\w$]+\s*=>/,

    /* Import/export statements */
    /^(import|export)\s+/,

    /* Semicolons at end (common in commented code) */
    /;$/,

    /* JSX/TSX elements */
    /^<[\w/]/,

    /* Type annotations */
    /:\s*(string|number|boolean|any|void|never|unknown|object)\s*[,;)=]/,
  ];

  return codePatterns.some((pattern) => pattern.test(trimmed));
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
    version: '1.0.0',
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
