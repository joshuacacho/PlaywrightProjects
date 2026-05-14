# GreenKart - Basic Operations Test Plan

## Application Overview

GreenKart is an e-commerce application for buying vegetables and fruits online. The application features product browsing, search functionality, shopping cart management, special offers/deals section, and a checkout process. The test plan covers basic user operations including product discovery, cart management, search, and checkout workflows.

## Test Scenarios

### 1. Product Discovery and Cart Management

**Seed:** `tests/seedfromScratch.spec.ts`

#### 1.1. Add single product to cart

**File:** `tests/greenkart/add-single-product.spec.ts`

**Steps:**
  1. Navigate to the GreenKart home page (https://rahulshettyacademy.com/seleniumPractise/#/)
    - expect: Page loads successfully
    - expect: Product list displays with vegetables and fruits
    - expect: Cart shows 0 items and 0 price
  2. Click the 'ADD TO CART' button for Broccoli (₹120)
    - expect: Item is added to cart
    - expect: Cart count updates to 1
    - expect: Cart total price updates to 120
  3. Verify the product is added by checking the cart summary
    - expect: Items counter displays 1
    - expect: Price counter displays 120

#### 1.2. Add multiple products to cart

**File:** `tests/greenkart/add-multiple-products.spec.ts`

**Steps:**
  1. Navigate to the GreenKart home page
    - expect: Page loads with empty cart (Items: 0, Price: 0)
  2. Add Broccoli to cart by clicking 'ADD TO CART'
    - expect: Broccoli added successfully
    - expect: Cart shows Items: 1, Price: 120
  3. Add Cauliflower to cart
    - expect: Cauliflower added successfully
    - expect: Cart shows Items: 2, Price: 180
  4. Add Cucumber to cart
    - expect: Cucumber added successfully
    - expect: Cart shows Items: 3, Price: 228
  5. Verify all items are in the cart
    - expect: All three products are counted in cart
    - expect: Total price is correctly calculated (120 + 60 + 48)

#### 1.3. View cart contents

**File:** `tests/greenkart/view-cart.spec.ts`

**Steps:**
  1. Add Broccoli and Tomato to cart
    - expect: Items added successfully
    - expect: Cart shows 2 items
  2. Click on the Cart icon/link in the header
    - expect: Cart dropdown opens
    - expect: Shows list of all cart items with images
    - expect: Each item displays product name, price per unit, quantity, and total
  3. Verify cart items display correctly
    - expect: Broccoli displays as 1 No., ₹120
    - expect: Tomato displays as 1 No., ₹16
    - expect: Remove button (×) is visible for each item

#### 1.4. Remove item from cart

**File:** `tests/greenkart/remove-item-from-cart.spec.ts`

**Steps:**
  1. Add Broccoli and Cauliflower to cart
    - expect: Both items added
    - expect: Cart shows Items: 2, Price: 180
  2. Click on Cart to open cart dropdown
    - expect: Cart dropdown displays both items
  3. Click the remove button (×) next to Broccoli
    - expect: Broccoli is removed from cart
    - expect: Cart updates to show only Cauliflower
    - expect: Items count becomes 1
    - expect: Price updates to 60

#### 1.5. Adjust product quantity using spinbutton

**File:** `tests/greenkart/adjust-quantity.spec.ts`

**Steps:**
  1. Navigate to the home page
    - expect: Product list is displayed with default quantity of 1 for each item
  2. Click the '+' button next to Broccoli's quantity field to increase it to 2
    - expect: Broccoli quantity spinbutton updates to 2
  3. Click the '–' button to decrease the quantity back to 1
    - expect: Broccoli quantity spinbutton updates to 1
  4. Add Broccoli with the increased quantity to cart
    - expect: Product is added with the correct quantity

### 2. Search and Filter Functionality

**Seed:** `tests/seedfromScratch.spec.ts`

#### 2.1. Search for product by name

**File:** `tests/greenkart/search-product.spec.ts`

**Steps:**
  1. Navigate to GreenKart home page
    - expect: All 16 products are displayed in the product list
  2. Click on the search box and type 'tomato'
    - expect: Search box displays 'tomato' as user input
  3. Observe the product list after search
    - expect: Only Tomato product is displayed
    - expect: Other products are filtered out
    - expect: Tomato shows correct price of ₹16
  4. Clear the search box by deleting the text
    - expect: All 16 products are displayed again

#### 2.2. Search for non-existent product

**File:** `tests/greenkart/search-no-results.spec.ts`

**Steps:**
  1. Navigate to GreenKart home page
    - expect: All products are displayed
  2. Type 'xyz123' in the search box (non-existent product)
    - expect: No products are displayed
    - expect: Search filters out all products
  3. Clear the search
    - expect: All products reappear

#### 2.3. Case-insensitive search

**File:** `tests/greenkart/case-insensitive-search.spec.ts`

**Steps:**
  1. Search for 'POTATO' in uppercase
    - expect: Potato product is found and displayed
  2. Clear search and search for 'potato' in lowercase
    - expect: Potato product is found and displayed
  3. Clear search and search for 'PoTaTo' in mixed case
    - expect: Potato product is found and displayed
    - expect: Search is case-insensitive

### 3. Top Deals and Offers

**Seed:** `tests/seedfromScratch.spec.ts`

#### 3.1. Navigate to Top Deals page

**File:** `tests/greenkart/navigate-top-deals.spec.ts`

**Steps:**
  1. Navigate to GreenKart home page
    - expect: Home page loads successfully
  2. Click on 'Top Deals' link in the header
    - expect: Page navigates to offers section (URL changes to #/offers)
    - expect: Top Deals/Offers page loads

#### 3.2. View offers table and filtering

**File:** `tests/greenkart/offers-table.spec.ts`

**Steps:**
  1. Navigate to Top Deals page
    - expect: Offers page displays with a table
    - expect: Table has columns: Veg/fruit name, Price, Discount price
  2. Verify table content displays offers
    - expect: Table shows items like Wheat, Tomato, Strawberry, Rice, Potato with their prices and discounts
  3. Click on 'Veg/fruit name' column header to sort
    - expect: Table sorts by product name
    - expect: Currently sorted in descending order
  4. Click on 'Price' column header to sort
    - expect: Table sorts by price column

#### 3.3. Search offers and page size selection

**File:** `tests/greenkart/offers-search-pagination.spec.ts`

**Steps:**
  1. Navigate to Top Deals page
    - expect: Offers page displays with page size selector (5, 10, 20 options)
  2. Change page size from 5 to 10
    - expect: Page size updates to display 10 items per page
  3. Type 'Potato' in the search box within offers
    - expect: Table filters to show only Potato item
  4. Verify pagination controls are present
    - expect: First, Previous, page number buttons, Next, and Last buttons are displayed

#### 3.4. Set delivery date in offers

**File:** `tests/greenkart/offers-delivery-date.spec.ts`

**Steps:**
  1. Navigate to Top Deals page
    - expect: Delivery Date section is visible at the bottom of the page
  2. Observe the date spinbuttons showing current date
    - expect: Date displays as MM/DD/YYYY format
    - expect: Currently shows 5/11/2026
  3. Click on the calendar icon next to the date fields
    - expect: Date picker or calendar interface opens

### 4. Checkout Process

**Seed:** `tests/seedfromScratch.spec.ts`

#### 4.1. Proceed to checkout from cart

**File:** `tests/greenkart/proceed-to-checkout.spec.ts`

**Steps:**
  1. Add Broccoli and Cauliflower to cart
    - expect: Both items added successfully
    - expect: Cart shows Items: 2, Price: 180
  2. Click on Cart icon to open cart dropdown
    - expect: Cart dropdown displays with items
  3. Click 'PROCEED TO CHECKOUT' button
    - expect: Page navigates to cart page (URL changes to #/cart)
    - expect: Cart page loads successfully

#### 4.2. View cart page with items

**File:** `tests/greenkart/cart-page-view.spec.ts`

**Steps:**
  1. Add 2 items to cart and proceed to checkout
    - expect: Checkout page loads
    - expect: Shows cart table with all items
  2. Verify table displays correct columns
    - expect: Columns shown: #, Product Name, Quantity, Price, Total
  3. Verify cart items display correctly
    - expect: Broccoli shows: Quantity 1, Price 120, Total 120
    - expect: Cauliflower shows: Quantity 1, Price 60, Total 60
    - expect: Each item has product image

#### 4.3. Apply promo code

**File:** `tests/greenkart/apply-promo-code.spec.ts`

**Steps:**
  1. Add items to cart and navigate to checkout page
    - expect: Checkout page displays promo code section
  2. Locate the promo code input field and 'Apply' button
    - expect: Promo code textbox is present and editable
    - expect: Apply button is visible and clickable
  3. Enter an invalid/non-existent promo code and click Apply
    - expect: System validates the promo code
    - expect: Appropriate error message or no discount applied

#### 4.4. View cart summary and totals

**File:** `tests/greenkart/cart-summary.spec.ts`

**Steps:**
  1. Add Broccoli (₹120) and Cauliflower (₹60) to cart and go to checkout
    - expect: Checkout page displays cart summary
  2. Verify cart summary displays all details
    - expect: Shows 'No. of Items: 2'
    - expect: Shows 'Total Amount: 180'
    - expect: Shows 'Discount: 0%'
    - expect: Shows 'Total After Discount: 180'
  3. Verify calculations are correct
    - expect: Total Amount = Sum of all item totals (120 + 60 = 180)
    - expect: Discount calculation is correct

#### 4.5. Place order

**File:** `tests/greenkart/place-order.spec.ts`

**Steps:**
  1. Add items to cart and navigate to checkout page
    - expect: Checkout page displays with cart items and summary
  2. Verify 'Place Order' button is visible and enabled
    - expect: Place Order button is present on the checkout page
  3. Click the 'Place Order' button
    - expect: Order is submitted
    - expect: System processes the order
    - expect: Navigation occurs to confirmation or next step

### 5. Navigation and Links

**Seed:** `tests/seedfromScratch.spec.ts`

#### 5.1. Navigation between pages

**File:** `tests/greenkart/navigation.spec.ts`

**Steps:**
  1. Navigate to GreenKart home page
    - expect: Home page loads with product list
  2. Click on 'Top Deals' to go to offers page
    - expect: Offers page loads (URL: #/offers)
  3. Click on 'GREENKART' logo to return to home
    - expect: Home page loads again with product list
    - expect: Cart is reset to 0 items

#### 5.2. External navigation links

**File:** `tests/greenkart/external-links.spec.ts`

**Steps:**
  1. Navigate to GreenKart home page
    - expect: Page displays external links in header
  2. Verify 'Flight Booking' link is present
    - expect: Flight Booking link points to https://rahulshettyacademy.com/dropdownsPractise/
  3. Verify 'Get Shortlisted by Recruiters' link is present
    - expect: Link points to https://techsmarthire.com/

### 6. Edge Cases and Validation

**Seed:** `tests/seedfromScratch.spec.ts`

#### 6.1. Add same product to cart twice

**File:** `tests/greenkart/add-duplicate-product.spec.ts`

**Steps:**
  1. Add Broccoli to cart
    - expect: Broccoli added, Items: 1, Price: 120
  2. Click 'ADD TO CART' for Broccoli again
    - expect: Broccoli is added again
    - expect: Items counter becomes 2
    - expect: Price updates to 240 (120 + 120)
  3. Open cart and verify both Broccoli items
    - expect: Both items are in cart or quantity is incremented to 2

#### 6.2. Empty cart behavior

**File:** `tests/greenkart/empty-cart.spec.ts`

**Steps:**
  1. Add items to cart
    - expect: Items added successfully
  2. Open cart dropdown and remove all items
    - expect: All items are removed
    - expect: Cart shows Items: 0, Price: 0
  3. Verify empty cart state
    - expect: No items display in cart dropdown
    - expect: Cart counts are reset to zero

#### 6.3. Cart persistence across navigation

**File:** `tests/greenkart/cart-navigation-persistence.spec.ts`

**Steps:**
  1. Add items to cart on home page
    - expect: Items added, cart shows count and price
  2. Navigate to Top Deals page
    - expect: Offers page loads
    - expect: Cart is reset or state is not maintained
  3. Return to home page
    - expect: Home page loads
    - expect: Note if cart state was preserved or reset

#### 6.4. Search with special characters

**File:** `tests/greenkart/search-special-characters.spec.ts`

**Steps:**
  1. Try searching with special characters like '!@#$%'
    - expect: No products match
    - expect: Search handles special characters gracefully
  2. Try searching with numbers
    - expect: Search handles numeric input
  3. Try searching with spaces
    - expect: Search handles whitespace correctly
