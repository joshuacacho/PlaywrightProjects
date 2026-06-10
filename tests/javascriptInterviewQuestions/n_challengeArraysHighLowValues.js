/* Test your JavaScript Array knowledge

Create an array called expenses that contains at least 5 different expense amounts.

Calculate the total expenses by summing all the elements of the array.

Find the highest and lowest individual expenses within the array.
*/

let expenses = [200, 100, 300, 500, 400];

//using accumulator to add all the expenses together, where total starts at 0 and adds each expense to it
const totalExpenses = expenses.reduce((total,expense) => total + expense, 0);
console.log(totalExpenses);

//finding the lowest value in the array using reduce, where lowest starts at the first expense and compares it to each expense in the array, returning the lowest value
const lowestExpense = expenses.reduce((lowest, expense) => {
           /*if (expense < lowest) {//start is 100 < 100, 200 < 100, and so on if values were sorted
                return expense;
                } else {
                return lowest;
                }
            */
           //condition ? valueIfTrue : valueIfFalse
    return expense < lowest ? expense : lowest;
}, expenses[0]);  //starting lowest at the first expense in the array, which is 100, and comparing it to each expense in the array to find the lowest value
console.log(lowestExpense);

const highestExpense = expenses.reduce((highest,expense) => {
     /*if (expense > highest) { {//start is 100 > 100, 200 > 100, 300 > 200, and so on if values were sorted
                return expense;
                } else {
                return highest;
                }
            */
           //condition ? valueIfTrue : valueIfFalse
    return expense > highest ? expense : highest;
}, expenses[0]);  //starting highest at the first expense in the array, which is 100, and comparing it to each expense in the array to find the highest value
console.log(highestExpense);