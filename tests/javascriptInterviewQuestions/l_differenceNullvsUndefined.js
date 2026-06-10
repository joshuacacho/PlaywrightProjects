// 01:03:32 - What is the difference between null and undefined in JavaScript?

//In JavaScript, null is an assignment value that represents the intentional absence of any object value. It is often used to indicate that a variable should have no value or that an object property is intentionally empty. 

//as is defined
let a = null;
console.log(a);
console.log(typeof a); // Output: object


//On the other hand, undefined is a primitive value that indicates that a variable has not been assigned a value or that a function does not return a value. It is also the default value of uninitialized variables and function parameters that are not provided with an argument. 

// b is not defined
let b;
console.log(b);
console.log(typeof b); // Output: undefined


//In summary, null is an explicit value that represents the absence of a value, while undefined indicates that a variable has not been assigned a value or that a function does not return a value.