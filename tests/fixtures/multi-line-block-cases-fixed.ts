/*
 * These are subsequent single line comments that should be converted to multi-line comment.
 * But when these comments follow each other, without empty lines in between,
 * they should become one multi-line block comment like below:
 */

/*
 * This is how subsequent single line comments that should be converted to multi-
 * line comment should look.
 */

const someObject = {
  key: 'value',
  anotherKey: {
    /*
     * This should be a nested multi-line comment
     * inside an object.
     */
    nestedKey: 'nestedValue',
    anotherNestedKey: {
      /*
       * This is a single line comment that should be converted to multi-line
       * comment.
       * Lines should be properly indented and wrapped when it exceeds the
       * default 80 characters, or by a configurable amount.
       */
      deepNestedKey: 'deepNestedValue',
    },
  },
};

export default someObject;
