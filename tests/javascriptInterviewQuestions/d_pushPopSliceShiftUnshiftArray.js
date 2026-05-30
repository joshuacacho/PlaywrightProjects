// 16:26 - Where are the push, pop, slice, shift, and unshift methods used when accessing array elements?

// The push, pop, slice, shift, and unshift methods are used to manipulate arrays in JavaScript. They allow you to add, remove, or access elements in an array in different ways.

// 1. push: The push method is used to add one or more elements to the end of an array. It modifies the original array and returns the new length of the array.

// Example:
const arr1 = [1, 2, 3];
arr1.push(4); // Adds 4 to the end of the array
console.log(arr1); // Output: [1, 2, 3, 4]

// 2. pop: The pop method is used to remove the last element from an array. It modifies the original array and returns the removed element. 
const arr2 = [1, 2, 3];
const removedElement = arr2.pop(); // Removes the last element (3) from the array
console.log(arr2); // Output: [1, 2]
console.log(removedElement); // Output: 3

// 3. slice: The slice method is used to create a new array that contains a portion of the original array. It does not modify the original array and returns the new array.

// Example:
const arr3 = [1, 2, 3, 4, 5];
const slicedArray = arr3.slice(1, 4); // Creates a new array with elements from index 1 to index 3 (4 is not included)
console.log(arr3); // Output: [1, 2, 3, 4, 5] (original array is unchanged)
console.log(slicedArray); // Output: [2, 3, 4]

// 4. shift: The shift method is used to remove the first element from an array. It modifies the original array and returns the removed element.

// Example:
const arr4 = [1, 2, 3];
const shiftedElement = arr4.shift(); // Removes the first element (1) from the array
console.log(arr4); // Output: [2, 3]
console.log(shiftedElement); // Output: 1

// 5. unshift: The unshift method is used to add one or more elements to the beginning of an array. It modifies the original array and returns the new length of the array.

// Example:
const arr5 = [2, 3];
arr5.unshift(1); // Adds 1 to the beginning of the array
console.log(arr5); // Output: [1, 2, 3]

// In summary:
// - push adds elements to the end of an array.
// - pop removes the last element from an array.
// - slice creates a new array with a portion of the original array.
    //if we do slice(1,3) we get the elements from index 1 (inclusive) to index 2 (3 is not included and NOT inclusive).
// - shift removes the first element from an array.
// - unshift adds elements to the beginning of an array.


//for each example, we can also use the teacher's example to further illustrate the usage of these methods.
const fruits = ["apple", "banana", "cherry"];

fruits.forEach((fruit, index) => {
    console.log(`Index: ${index}, Fruit: ${fruit}`);
    }
);