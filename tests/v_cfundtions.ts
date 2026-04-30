//functions with typescript

function add(a,b) {
    return a+b;
}

add(3,4);


function addTS(a: number, b:number) : number {
    return a+b;
}

//b defined as number and cant be string
addTS(3,"4");


//objects with