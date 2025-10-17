/**
 * Integration Example - How to Use the Plugin
 *
 * This file demonstrates various scenarios the plugin handles
 */

// ❌ INCORRECT: Text comment using single-line style
// This is a documentation comment explaining the variable

// ✅ CORRECT: Text comment using multi-line style
/* This is a documentation comment explaining the variable */

const value = 42;

// ❌ INCORRECT: Code comment using multi-line style
/* const oldValue = 100; */

// ✅ CORRECT: Code comment using single-line style
// const oldValue = 100;

// ❌ INCORRECT: Multiple code lines in multi-line comment
/*
const x = 1;
const y = 2;
const z = x + y;
*/

// ✅ CORRECT: Multiple code lines using single-line comments
// const x = 1;
// const y = 2;
// const z = x + y;

/**
 * Multi-line JSDoc comments are preserved
 * These are recognized as documentation
 * @param name The user's name
 * @returns A greeting message
 */
function greet(name: string): string {
  // ❌ INCORRECT: Commented out debug code in multi-line style
  /* console.log('Debug:', name); */

  // ✅ CORRECT: Commented out debug code in single-line style
  // console.log('Debug:', name);

  // ❌ INCORRECT: Explanation in single-line style
  // Return the formatted greeting

  // ✅ CORRECT: Explanation in multi-line style
  /* Return the formatted greeting */

  return `Hello, ${name}!`;
}

// Examples of what gets detected as code:

/* if (condition) { doSomething(); } */ // ❌ Control flow
/* for (let i = 0; i < 10; i++) { } */ // ❌ Loops
/* const arr = [1, 2, 3]; */ // ❌ Arrays
/* obj.method(); */ // ❌ Method calls
/* import { foo } from 'bar'; */ // ❌ Imports
/* export default MyClass; */ // ❌ Exports
/* const fn = () => { return true; }; */ // ❌ Arrow functions
/* interface User { name: string; } */ // ❌ Type definitions

// All of the above should be single-line comments like:
// if (condition) { doSomething(); }
// for (let i = 0; i < 10; i++) { }
// etc.

export { greet };
