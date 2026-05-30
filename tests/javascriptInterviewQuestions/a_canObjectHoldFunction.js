//00:21 - Can a JavaScript object hold a function as a property? Explain with an example.

//Yes, a JavaScript object can hold a function as a property. In JavaScript, functions are first-class objects, which means they can be assigned to variables, passed as arguments to other functions, and stored in objects.

//Here's an example:  
//javascript Define an object with a function as a property
const myObject = {
    name: "John",
    greet: function() {
        return `Hello, my name is ${this.name}!`;
    }
};

// Call the function stored in the object
console.log(myObject.greet()); // Output: Hello, my name is John!


//Teacher Example
const person = {
    name: "John",
    age: 30,
    sayHello: function() {
        return `Hello, my name is ${this.name} and I am ${this.age} years old.`;
    }
}

console.log(person.sayHello()); // Output: Hello, my name is John and I am 30 years old.