class DashboardPage{

    constructor(page) {
         //activates page to be used everywhere in your class
        this.page = page;

        //define the objects on the page we have used so far to add a random item to the cart
        this.cardProductName = page.locator("h5 b");
        this.cardProductButton = page.locator("button");
        this.itemsInCart = page.getByRole('button', { name: '   Cart' });
        this.cartCountSuccToast = page.getByRole('alert', { name: 'Product Added To Cart' });
        this.productCardTitle =  page.locator(".card-body h5");
    }

    //add random item to the cart
    async addRandomItemToCart() {
        try {

            // Wait for at least one card to be visible before collecting
                //tried putting in separate async function but didnt always work so moved directly here
                //makes sense since its part of the add random item to cart page
            await this.cardProductName.first().waitFor({ state: "visible" });

            //gather all card product name contens
            let productNames = await this.cardProductName.allTextContents();
            console.log(typeof productNames); //array of product names
            //console.log(productText);

            //DEFENSE CODING - Filter out any empty or undefined values defensively 
                //for edge cases where information can come back malformed
                    /*
                        Scenario                                       Result without filter
                        Card rendered but text lazy-loaded separately. Empty string "" in array
                        Whitespace-only text node in DOM               "   " passes undefined check but breaks logic
                        Network hiccup causes partial card data        Empty or garbage string in array
                        Browser still interpolating dynamic text       Empty string at that index
                    */
            productNames = productNames.filter(name => name && name.trim() !== "");

            //gather all associated [Add to Cart] buttons that go with each card product name
            let productButtons = await this.cardProductButton.filter({ hasText: "Add To Cart" });
            console.log(typeof productButtons);  //array of buttons

            //debug to test the if statement below and throw an error
            //productNames.length = 0;
            
            //DEFENSE CODING - ensure we have ProductNames before doing the work below
            if(productNames.length === 0) {
                throw new Error("No products found on the dashboard");
            }

            //dynamically find and click Add to Cart button for a specific product by selecting a random productName
            let randomProduct = Math.floor(Math.random() * productNames.length);
            //randomProduct = Math.floor(Math.random() * productText.length);
            console.log("Random Product Name: " + productNames[randomProduct]);

           
            //click the associated add to cart button for the random product selected
                //both are arrays so zero based indexed so this is safe to use
            await productButtons.nth(randomProduct).click();

        } catch (error) {
            console.error(error.stack);
        }
    }

    //obtain Cart Count
    async getCartCount() {
        let cartCount;
        try {
            cartCount = await this.itemsInCart.textContent();
            console.log(cartCount);
        } catch (error) {
            console.error(error.stack);
        }
    
        return cartCount;
    }
    
    //verify if product is present
        //never tried but should work since we are just filtering the list of product names we have already obtained and checking if the product name we are looking for is in that list and visible on the page
    async verifyProductExists(productName) {
        try {
            const productCard = this.productCardTitle.filter({ hasText: productName });
            //console.log(await productCard.isVisible());
            return await productCard.isVisible();
        } catch (error) {
            console.error(error.stack);
            return false;
        }
    }

}


module.exports = { DashboardPage };


