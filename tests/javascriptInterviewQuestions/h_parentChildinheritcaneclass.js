//49:15 - Create an inheritance relationship between a parent and child class. Invoke the parent constructor from the child class. Create main.js to call parent class methods from a child class object.

///This file is the parent class

//define parent class
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    //method of parent class to get persons details
    getDetails() {
        return `Name: ${this.name}, Age: ${this.age}`;
    }
}

module.exports = Person;