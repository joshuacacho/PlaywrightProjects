/*
Manipulate an array of strings (add, remove, sort)
Create an array named studentNames with the names of your students.

Add a new student name to the beginning of the array.

Remove the last student name from the array.

Alphabetize the student names within the array.

*/


// In summary:
// - push adds elements to the end of an array.
// - pop removes the last element from an array.
// - slice creates a new array with a portion of the original array.
    //if we do slice(1,3) we get the elements from index 1 (inclusive) to index 2 (3 is not included and NOT inclusive).
// - shift removes the first element from an array.
// - unshift adds elements to the beginning of an array.


const studentNames = ['Amy','Joe','Bob','Sally','Roger'];

//add items to start of array using unshift
studentNames.unshift("Zach"); //add Zach to start of the array
console.log(studentNames);

//remove the last item from the array
studentNames.pop(); //removes Roger from the end of the array
console.log(studentNames);


//alphpabitize the array 
studentNames.sort();
console.log(studentNames);