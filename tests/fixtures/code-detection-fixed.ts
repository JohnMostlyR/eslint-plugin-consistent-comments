/* This file tests various code detection patterns */

/* Variable declarations with different keywords */
// const x = 5;
// let y = 10;
// var z = 15;

/* Function declarations and expressions */
// function test() { return true; }
// const arrow = () => {};
// const func = function() {};

/* Import and export statements */
// import { foo } from "bar";
// export default class Test {}
// export const value = 42;

/* Control flow statements */
// if (condition) { doSomething(); }
// for (let i = 0; i < 10; i++) { }
// while (true) { break; }
// return result;

/* Method calls and property access */
// obj.method();
// array.map(x => x * 2);
// console.log('test');

/* Assignment operators */
// x = 5;
// x += 1;
// obj.prop = 'value';

/* Data structures */
// const arr = [1, 2, 3];
// const obj = { key: 'value' };

/* Type annotations (TypeScript) */
// type User = { name: string };
// interface Config { port: number; }

/* Class declarations */
// class MyClass { constructor() {} }

/*
 * This is plain text that should use multi-line
 * Another line of text
 * And one more
 */

const actualCode = 'This is real code';

// const commented = 'code';
// const more = 'commented code';

/* Documentation about the export */
export { actualCode };
