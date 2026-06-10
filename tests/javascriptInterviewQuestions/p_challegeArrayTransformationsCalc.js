/*

Apply transformations and calculations to array elements, and filter elements based on a condition
You have an array called productPrices with various product prices.

Apply a 10% discount to all prices using the map method and store the results in a new array called discountedPrices.

Use the filter method to create a new array called affordableProducts containing only products priced below $50

Calculate the total cost of all items in the affordableProducts array using the reduce method.

*/

const productionPrices = [300,200,100,50,35,28,75];

//Apply a 10% discount to all prices using the map method and store the results in a new array called discountedPrices.
const discountedPrices = productionPrices.map(price => price * .10);
console.log(discountedPrices);

//Use the filter method to create a new array called affordableProducts containing only products priced below $50
const affordableProducts = productionPrices.filter(price => price < 50);
console.log(affordableProducts);


//Calculate the total cost of all items in the affordableProducts array using the reduce method.
const totalCostAffordableProducts = affordableProducts.reduce((acc, price) => acc + price, 0);
console.log(totalCostAffordableProducts);