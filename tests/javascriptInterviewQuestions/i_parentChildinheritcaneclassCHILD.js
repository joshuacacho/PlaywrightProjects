//49:15 - Create an inheritance relationship between a parent and child class. Invoke the parent constructor from the child class. Create main.js to call parent class methods from a child class object.

///This file is the child class

const Person = require('./h_parentChildinheritcaneclass.js');

//define child class that inherits from parent class
class Student extends Person {
    constructor(name, age, grade) {
        //always inherit the parent class constructor first before adding any new properties or methods in the child class
        super(name, age); // Call the parent class constructor to initialize name and age
        this.grade = grade; // Initialize the grade property specific to Student
    }

    //method of child class to get students details
    getStudentDetails() {
        return `${this.getDetails()}, Grade: ${this.grade}`; // Call the parent class method to get name and age, and add grade information
    }
}

module.exports = Student;