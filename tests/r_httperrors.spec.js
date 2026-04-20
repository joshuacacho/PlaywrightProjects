const {test, expect} = require('@playwright/test');
const { createECDH } = require('node:crypto');

/*
   //Website to test SSL Errors
   Sites for Specific SSL/TLS Errors
    If you need to test specific browser error screens (e.g., "Your connection is not private"), BadSSL.com provides a comprehensive suite of intentional failures:
    Expired Certificate: expired.badssl.com triggers the "Expired Certificate" error.
    Wrong Host: wrong.host.badssl.com triggers an error where the certificate name does not match the domain.
    Self-Signed: self-signed.badssl.com tests how your system handles untrusted certificate authorities.
    Untrusted Root: untrusted-root.badssl.com mimics a certificate issued by an unknown entity. 
    YouTube
    YouTube
*/

//catch error via explcitiy catch
test("HTTPS Status Error - Expired Certificate Direct Catch Throw Error", async({page}) => {
    
    try {
        //navigate to url
        await page.goto("https://expired.badssl.com/");
    }
    catch (error) {

        // Check if the error message contains the specific SSL date error
        if (error.message.includes('ERR_CERT_DATE_INVALID')) {
            console.log('Caught expected certificate date error');
         }
    }
    

});


//using new browser context to catch the error via the page.on('requestfailed') event listener and then assert on the failure reason
test("HTTPS Status Error - Using New Browser Context ignoreHTTPSErrors Within The Test", async({browser}) => {
    
    //Browser contexts can be configured to ignore HTTPS errors, allowing you to test sites with invalid certificates without encountering blocking errors. This is particularly useful for testing how your application handles SSL/TLS issues or for accessing development environments with self-signed certificates.
  
  
    // Create a new browser context that ignores HTTPS errors
    const context = await browser.newContext({ ignoreHTTPSErrors: false }); // Set to true to ignore SSL errors, false to catch them
    const page = await context.newPage();
    
    //navigate to url
     await page.goto("https://expired.badssl.com/");
    // Test continues normally without SSL error blocking
    await page.pause();

    
});

//using global value within package.config.js file
test.only("HTTPS Status Error - Using package.config.js Global Setting ignoreHTTPSErrors", async({page}) => {
      
    //navigate to url
     await page.goto("https://expired.badssl.com/");
    // Test continues normally without SSL error blocking
    await page.pause();

    
});