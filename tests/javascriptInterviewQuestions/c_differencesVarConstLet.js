// 07:22 - What is the difference between var, const, and let? Explain with an example. 

// In JavaScript, var, const, and let are used to declare variables, but they have different characteristics and behaviors.

// 1. var: 
// - var is function-scoped, which means it is accessible within the function it is declared in. If declared outside of a function, it becomes a global variable.
// - Variables declared with var can be re-declared and updated.

//Example:
function exampleVar() {
    var x = 10; 
    console.log(x); // Output: 10
    var x = 20; // Re-declaration is allowed
    console.log(x); // Output: 20
}   
exampleVar();

// 2. let:
// - let is block-scoped, which means it is only accessible within the block (enclosed by {}) it is declared in.
// - Variables declared with let can be updated but cannot be re-declared within the same scope.

//Example:    
function exampleLet() {         
    let y = 10;
    console.log(y); // Output: 10
    y = 20; // Updating the variable is allowed
    console.log(y); // Output: 20
    // let y = 30; // This would cause an error because re-declaration is not allowed
}   
exampleLet();   

// 3. const:
// - const is also block-scoped, like let.
// - Variables declared with const cannot be updated or re-declared. They must be initialized at the time of declaration.

//Example:
function exampleConst() {
    const z = 10;
    console.log(z); // Output: 10
    // z = 20; // This would cause an error because updating a const variable is not allowed
    // const z = 30; // This would also cause an error because re-declaration is not allowed
}
exampleConst();

// In summary:
// - var is function-scoped and can be re-declared and updated.
// - let is block-scoped and can be updated but not re-declared in the same scope.
// - const is block-scoped and cannot be updated or re-declared.


//Teacher Examples
console.log("----------TEACHERS EXAMPLE----------");
function varExample() {
    var x=1;
    if(true){
        console.log(x); // Output: 1 (var is function-scoped)
        var x=2; // Re-declaration is allowed
    }

     console.log(x); // Output: 2 (var is function-scoped, so the re-declaration affects the entire function)
}

varExample();


function letExample() {
    let x=1;
    
    if(true){
        let x=2; // This x is different from the outer x because let is block-scoped
        y=3; // This will create a global variable y because it is not declared with var, let, or const
            //if we put let y=3; here, it would be block-scoped and not accessible outside the block and the consloe.log(y); would cause an error

        console.log(x); // Output: 2 (the inner x is accessible within the block)
    }

    console.log(y); // Output: 3 (y is a global variable)
    console.log(x); // Output: 1 (the outer x is not affected by the inner x)
}

letExample();

function constExample() {   
    const x=1;

    if(true){
        const x=2; // This x is different from the outer x because const is block-scoped
        console.log(x); // Output: 2 (the inner x is accessible within the block)
    }

    //x=3; // This will cause an error because updating a const variable is not allowed
    console.log(x); // Output: 1 (the outer x is not affected by the inner x)

}

constExample();