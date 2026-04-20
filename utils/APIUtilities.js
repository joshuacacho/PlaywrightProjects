class APIUtilities {

    //create constructor
        //when you create object of this class from your test we will pass this apiContext to our actual test
    constructor(apiContext, loginPayload) {

        //assigning local apicontext (this in this class) to be able to be accessed by your test case from the params
            //when you create a new object of this class
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    }

    //getTokenMethod
    async getToken() {

        let token; 

        try {                                     
            //api context
                //KEEP THIS IN OUR ACTUAL LOCATION .beforeALL
                 //const apiContext = await request.newContext();
        
            //making api calls on X API Call - NOT page like in web sessions
            const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
                data: this.loginPayload,
            });
        
            //from the response OBJECT (called loginResponseJSON here) we need to grab the token value
            const loginResponseJSON = await loginResponse.json();
            
            //you need intialize, token = WILL NOT WORK
            token = loginResponseJSON.token;
              
            //log the token
            console.log(token);

            return token;

        } catch (error) {
                console.error(`❌ Failed to inject token to URL: ${token}`, error.stack);
                throw error;
        }
    }

    /*
        Example Payload Response
        {
            orders: [ '6993757a1fe6115f6a8b5bfe' ],
            productOrderId: [ '6960eac0c941646b7a8b3e68' ],
            message: 'Order Placed Successfully'
        }
    */
    async createOrder(orderPayLoad) {

        //to do anything with this order LATER in our test case we need to pass the authorization token so
            //we will create two properies and return them in an object
        let response = {};
        response.token = await this.getToken();
    
        //making api calls on X API Call - NOT page like in web sessions
            //we copy the structure of the UI and implement it programatically
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", {
            data: orderPayLoad,
            headers: {
                'Content-Type': 'application/json',
                // Add headers as needed where in this case if you view the API the token is in the headers
                'Authorization': response.token
            }
        });
        
        let orderResponseJSON = await orderResponse.json();
        console.log(orderResponseJSON);
        const orderId = await orderResponseJSON.orders[0];
        response.orderId = orderId;
        console.log(response);

        //return the object which two properties of 
            //orderId and 
            // token 
        return response;
    }

}

//this line makes this class to be used globally
module.exports = { APIUtilities };