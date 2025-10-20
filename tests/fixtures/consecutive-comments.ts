/* This file tests consecutive single-line comments */

// This is the first line of documentation
// This is the second line
// This is the third line
// And a fourth line

function exampleOne() {
  // Another set of consecutive comments
  // explaining what this function does
  // in multiple lines
  return 'result';
}

// Single isolated text comment

// Yet another multi-line explanation
// that should be merged into a block
// comment format

const value = 42;

// Code comment should stay single-line
// const oldCode = true;

// But this is text again
// spanning multiple lines
// that should merge

/* Already a block comment - should stay */
const another = 'value';

// Indented consecutive comments
function nested() {
  // These are indented
  // and should also merge
  // into a block comment

  // const someCode = 'commented';
  // const moreCode = 'also commented';

  return true;
}

export { exampleOne, value, another, nested };
