// 23:19 - Is JavaScript Asynchronous? Prove with an example.

console.log("1st Program");
console.log("2nd Program");
console.log("3rd Program");
console.log("4th Program");
console.log("5th Program");
console.log("6th Program");

setTimeout(function () {
    console.log("7th Program");
}, 2000); // wait 2 seconds before executing the function

console.log("8th Program");