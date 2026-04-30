//static typing where the type of variable is intelligently NOT defined by the value assigned to it

//valid but will throw compiler error
let message1 = "Hello World!";

//valid and will NOT throw compiler error
let message2 : string = "Hello World! 2";


//Defining different types of variables
let age1: number = 10;
let isLoggedIn: boolean = false;
let numberArray: number[] = [1, 2, 3, 4, 5];
let stringArray: string[] = ["Hello", "World"];
let anyType: any = "This can be any type";
anyType = 42; // No error, can be reassigned to a different type

//Defining a variable without initializing it
let uninitializedVariable: string;
uninitializedVariable = "Now it's initialized";

//Log everything
console.log(message1, message2, age1, isLoggedIn, numberArray, stringArray, anyType, uninitializedVariable);