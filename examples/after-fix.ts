/* This is documentation about the code below */
const greeting = 'Hello, World!';

/* This should be a multi-line comment */
const name = 'John';

// const oldCode = 'this should use single-line';
// function oldFunction() { return true; }

// if (condition) { doSomething(); }
// for (let i = 0; i < 10; i++) { }

// const x = 5;
// const y = 10;
// const sum = x + y;

// Array.from([1, 2, 3]).map(x => x * 2);

/*
 * This is a proper JSDoc comment
 * It explains what the function does
 */
function sayHello(name: string): string {
  // const debug = true;
  // console.log('debug mode');

  /* Another text comment here */

  return `Hello, ${name}!`;
}

export { sayHello };
