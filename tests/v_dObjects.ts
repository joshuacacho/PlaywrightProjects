//objects with typescript


//no values defined for name and age
let user = { name: "John", age: 30 };


//values defined for name and age
    //wont work as age is defined as string and cant be number
    let userTS: { name: string; age: string } = { name: "John", age: 30 };

    //will work as age is defined as number
    let userTS2: { name: string; age: number } = { name: "John", age: 30 };


    

//you cant add objects to an already defiend object in typescript
user.address = "123 Main St"; // This will work in JavaScript but will cause an error in TypeScript

