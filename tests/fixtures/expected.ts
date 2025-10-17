/* This is a regular comment explaining the code below */
const greeting = 'Hello, World!';

/* This is also a documentation comment */
const name = 'John';

// const oldCode = 'this should be flagged';
// function oldFunction() { return true; }

/* Regular text comment that should be multi-line */

/*
 * Multi-line documentation comment
 * This explains what the function does
 */
function sayHello(name: string): string {
  // const debug = true;
  // console.log('debug mode');
  return `Hello, ${name}!`;
}

// if (condition) { doSomething(); }
// for (let i = 0; i < 10; i++) { }

// const x = 5;
// const y = 10;
// const sum = x + y;

export { sayHello };
