//38:09 - What are promises in JavaScript? Explain the difference between callback functions and promises with an example.

function fetchData(callback) {
    if (typeof callback !== "function") {
        throw new TypeError(`fetchData expects a function, but got: ${typeof callback}`);
    }

    //THE TASK to be done BEFORE the callback function is executed is to fetch data from a server. Once the data is fetched, we will execute the callback function with the fetched data as an argument.
    setTimeout(() => {
        console.log("Fetching data from server...");
        const data = "Fetched Data";
        callback(data); // Call the callback function with the fetched data
    }, 2000); // Simulate a 2-second delay
}


//Now let's see how we can achieve the same functionality using promises instead of callback functions.
function processData(data) {
    console.log("Processing data:", data);
}

//So what will happen is javascript will execute the below fetchData function immediately bt attempting to run the processData function but will wait for the data to be fetched from the server before executing the processData function. This is how promises work in JavaScript, allowing us to handle asynchronous operations and execute code after a certain task is completed without blocking the main thread.
fetchData(processData);   // ✅ "Processing data: Fetched Data"

