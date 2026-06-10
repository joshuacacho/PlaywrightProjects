// 01:00:05 - What is the difference between == and ===?

//The == operator is the loose equality operator, which performs type coercion before comparing the values. This means that if the values being compared are of different types, JavaScript will attempt to convert them to a common type before making the comparison. For example, 5 == "5" would return true because the string "5" is coerced to the number 5 before the comparison is made.

console.log(5 == "5"); // Output: true

//The === operator is the strict equality operator, which does not perform type coercion. It compares both the value and the type of the operands. For example, 5 === "5" would return false because the number 5 and the string "5" are of different types.

console.log(5 === "5"); // Output: false

//In summary, the main difference between == and === is that == allows for type coercion while === does not. It is generally recommended to use === for comparisons in JavaScript to avoid unexpected results due to type coercion.
