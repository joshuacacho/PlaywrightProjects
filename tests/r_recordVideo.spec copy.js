const {test, expect} = require('@playwright/test');
const { createECDH } = require('node:crypto');



//using global value for recording a video
test("HTTPS Status Error - Using package.config.js Global Setting permissions with recording a video", async({page}) => {
      
    //navigate to url
     await page.goto("https://www.google.com/maps/dir//San+Diego,+CA+92116/@32.7665913,-117.1506945,14z/data=!4m17!1m8!3m7!1s0x80d95454b4f63225:0x819975e08bcf5e75!2sSan+Diego,+CA+92116!3b1!8m2!3d32.7679176!4d-117.1235339!16s%2Fm%2F01zmqzv!4m7!1m0!1m5!1m1!1s0x80d95454b4f63225:0x819975e08bcf5e75!2m2!1d-117.1235339!2d32.7679176?entry=ttu&g_ep=EgoyMDI2MDQwMS4wIKXMDSoASAFQAw%3D%3D");
    // Error to see video
     await page.getByText('Your dsfasadf', { exact: true }).click();
    //await page.pause();

    
});