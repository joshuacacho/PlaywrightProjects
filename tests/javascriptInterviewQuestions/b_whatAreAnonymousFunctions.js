// 03:28 - What are anonymous functions in JavaScript? Define their syntax and implementation.

// Anonymous functions in JavaScript are functions that do not have a name. They are often used as arguments to other functions or as immediately invoked function expressions (IIFEs). The syntax for an anonymous function is similar to that of a regular function, but without a name.

//IIFEs were heavily used before ES6 modules became standard. Today they're less common but still useful for quick encapsulation or running async code at the top level in environments that don't support top-level await.

// Here is the syntax for an anonymous function:
const anonymousFunction = function() {
    // function body
};

//Teacher Example
const greet = function(name) { 
    return "Hello I am " + name;
}

console.log(greet("John")); // Output: Hello I am John

//Example of using an anonymous function as a callback:
setTimeout(function() {
    console.log("This is an anonymous function being executed after 2 seconds.");
}, 2000);


//Example of an immediately invoked function expression (IIFE):
(function() {
    console.log("This is an IIFE, which is an anonymous function that runs immediately.");
})();

//Example of an IIFE with parameters:
(function(name) {
  console.log(`Hello, ${name}!`);
})("Alice");

//Example of an IIFE that returns a value:
const result = (function() {
  return 42;
})();

console.log(result); // 42


