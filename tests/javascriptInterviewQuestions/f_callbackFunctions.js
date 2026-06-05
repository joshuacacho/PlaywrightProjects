// 27:53 - What are callback functions in JavaScript?

// Callback functions are functions that are passed as arguments to other functions and are executed after a certain task is completed. They allow us to handle asynchronous operations in JavaScript, such as fetching data from a server or performing time-consuming tasks without blocking the main thread.


// In this example, fetchData simulates fetching data from a server with a delay. Once the data is fetched, it calls the callback function (processData) with the fetched data. This ensures that processData is executed only after the data is available, demonstrating how callback functions can be used to handle asynchronous operations in JavaScript.   

//By using the keyword callback we are saying that someones wants to execute their fuction after I am done with my task. So I will execute their function after I am done with my task. This is how callback functions work in JavaScript, allowing us to handle asynchronous operations and execute code after a certain task is completed.


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

function processData(data) {
    console.log("Processing data:", data);
}

function modifiedData(data) {
    console.log("Modifying data:", data);
}

//So what will happen is javascript will execute the below fetchData function immediately bt attempting to run the processData function but will wait for the data to be fetched from the server before executing the processData function. This is how promises work in JavaScript, allowing us to handle asynchronous operations and execute code after a certain task is completed without blocking the main thread.
fetchData(processData);   // ✅ "Processing data: Fetched Data"
fetchData(modifiedData);  // ✅ "Modifying data: Fetched Data"
