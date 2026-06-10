// 01:06:36 - A classic programming interview question that involves using array methods (filter, map, reduce), and JavaScript objects.

//Creating an array of students objects with name and score properties
const students = [
  { name: "Alice", score: 75 },
  { name: "Bob", score: 30 },
  { name: "Charlie", score: 85 }
];


/***SIMPLEST METHOD WHERE YOU SEE EVERYTHING****/
console.log("More simple method one by one:");

//using filter method to create a new array of students who passed with a greater score than 36
const passedStudents = students.filter(student => student.score > 36);
console.log(passedStudents); // Output: [{ name: "Alice", score: 75 }, { name: "Charlie", score: 85 }]

//using map method to place all passes students names in uppercase
const passedStudentNames = passedStudents.map(student => student.name.toUpperCase());
console.log(passedStudentNames); // Output: ["ALICE", "CHARLIE"]

//using reduce (takes two arguments, acc and the student.score where acc starts at) method to add the total scores of all students who passed with a greater score than 36
    //acc + student.score, 0 means that we are adding the score of each student to an accumulator (acc) that starts at 0. The reduce method iterates through the passedStudents array and for each student, it adds their score to the accumulator. After the reduce method has processed all students, it returns the total score of all students who passed with a greater score than 36.
const totalPassedScore = passedStudents.reduce((acc, student) => acc + student.score, 0);
console.log(totalPassedScore); // Output: 160


/***MORE COMPLICATED WAY****/
console.log("More complicated using chianing method:");

//filter out students who passed with a greater score than 36 and map their names to uppercase
const isPassed = students
    .filter((student) => student.score > 36)
    .map((student) => student.name.toUpperCase());


const totalScore = students
  .filter((student) => student.score > 36)
  .reduce((acc, student) =>  acc + student.score, 0);


console.log(isPassed); // Output: ["ALICE", "CHARLIE"]
console.log(totalScore); // Output: 160


