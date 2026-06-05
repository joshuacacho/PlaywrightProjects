//38:09 - What are promises in JavaScript? Explain the difference between callback functions and promises with an example.

const reject = require("underscore/cjs/reject.js");

function fetchData(callback) {
    if (typeof callback !== "function") {
        throw new TypeError(`fetchData expects a function, but got: ${typeof callback}`);
    }

    /*OLD WAY IN PREVIOUS EXAMPLE USING f_callbackFunctions CALLBACK FUNCTIONS*/
        //THE TASK to be done BEFORE the callback function is executed is to fetch data from a server. Once the data is fetched, we will execute the callback function with the fetched data as an argument.
        /*setTimeout(() => {
            console.log("Fetching data from server...");
            const data = "Fetched Data";
            callback(data); // Call the callback function with the fetched data
        }, 2000); // Simulate a 2-second delay*/
    
    /*New way using promises*/
        //when fetch data from server it is either resolved, pending or rejected. So we will return a new promise that will be resolved with the fetched data once the data is fetched from the server. This allows us to handle asynchronous operations in a more elegant way compared to callback functions, as promises provide a cleaner syntax and better error handling capabilities.
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Fetching data from server...");
            const data = "Sample Data"
            //reject example
                //reject("Error fetching data"); // Reject the promise with an error message
            
            //resolve example
            resolve(data); // Resolve the promise with the fetched data
        }, 2000); // Simulate a 2-second delay
    })
}

//Now let's see how we can achieve the same functionality using promises instead of callback functions.
    //NOT NEEDED when using promises
    /*function processData(data) {
        console.log("Processing data:", data);
    }*/

//resolving the promise and then processing the data after the promise is resolved. This is how callback functions work in JavaScript, allowing us to handle asynchronous operations and execute code after a certain task is completed.

//In the below code, we are calling the fetchData function and then using the .then() method to specify what should happen once the promise is resolved (i.e., once the data is fetched). The processData function will be called with the fetched data as an argument. If there is an error during the fetching process, it will be caught and logged to the console using the .catch() method. This demonstrates how promises can be used to handle asynchronous operations in JavaScript, providing a cleaner and more readable way to manage callbacks compared to traditional callback functions.

//the flow will be we will attempt to fetch data and if the promise is
    //pending - never execute the .then() method
    //rejected - never execute the .then() method but execute the .catch() method
    //resolved - execute the .then() method and never execute the .catch() method
        //if resolved then we will execute the processData function with the fetched data as an argument. This is how promises work in JavaScript, allowing us to handle asynchronous operations and execute code after a certain task is completed without blocking the main thread.
fetchData().then(function(data) {
    //moved from the previous function above
    console.log("Processing data:", data);
    processData(data); // ✅ "Processing data: Fetched Data"
}).catch(function(error) {
    console.error("Error fetching data:", error);
});

//you can even do the resolving of the promise this way
    //instead of calling the function, then waiting until its resolved then performing the function the await implicitly waits until the funciton is resolved and then performs the function. 
const data = await fetchData();  // ✅ "Processing data: Fetched Data" and WONT GO to next line until data is fetched and promise is resolved
console.log("Processing data:", data);