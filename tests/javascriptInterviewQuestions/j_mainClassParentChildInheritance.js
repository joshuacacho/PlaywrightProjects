//49:15 - Create an inheritance relationship between a parent and child class. Invoke the parent constructor from the child class. Create main.js to call parent class methods from a child class object.

const Person  = require('./h_parentChildinheritcaneclass.js')
const Student  = require('./i_parentChildinheritcaneclassCHILD')


const student1 = new Student('John Does', 20, 'A');

console.log(student1.getDetails()); // Output: Name: John Doe, Age: 20 which inherits from the parent class method
console.log(student1.getStudentDetails()); // Output: Name: John Doe, Age: 20, Grade: A