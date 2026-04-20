const { test, expect } = require("@playwright/test");
const ExcelJS  = require ("exceljs");
const fs = require ('fs');
const path = require ('path');


const uploadDownloadURL = 'https://rahulshettyacademy.com/upload-download-test/index.html';
let testWorkSheet;
let workBook;
const textSearch = 'Mango';
const modifiedPrice = 60.12;

test("Download Excel File - Manipulate Some Data - Reupload - Verify Modified Data is Seen", async ({page}, testInfo) => {
    
    
    await goToURL(page, uploadDownloadURL);

    const [download] = await Promise.all ([
        page.waitForEvent('download'),
        page.getByRole("button", { name : 'Download'}).click(),
    ]);
  
    // Get the suggested filename and define a custom save path
     const suggestedFilename = download.suggestedFilename();
  
    // Using testInfo.outputPath() ensures the file goes into the test artifacts folder
    const customDownloadPath = testInfo.outputPath(suggestedFilename); 
    console.log(customDownloadPath);

    // 3. Save the file to the custom path
    await download.saveAs(customDownloadPath);

    // 4. Verify the file exists at the custom path using Node's fs module
    expect(fs.existsSync(customDownloadPath)).toBe(true);

    const stats = fs.statSync(customDownloadPath);
    console.log(stats);
    expect(stats.size).toBeGreaterThan(0);

    //creating object from that last using the method WorkBook
     workBook = new ExcelJS.Workbook();

    await workBook.xlsx.readFile(customDownloadPath);
    testWorkSheet = workBook.getWorksheet("Sheet1");
    
    // 5. Write to excel file and mofiy price
    writeExcel(textSearch, "", {rowChange:0, colChange:2}, modifiedPrice, customDownloadPath); 

    // 6. Within UI upload file 
    const uploadFileBut = page.locator("#fileinput");
    //the .setInputFiles ONLY works if the attribute 'type' is set to 'file'
        //<input type="file" id="fileinput" accept=".xlsx,.xlx" class="upload" css="1">
    // Start waiting for file chooser before clicking. Note no await.
    const fileChooserPromise = page.waitForEvent('filechooser');
    await uploadFileBut.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(customDownloadPath);


    // 7. Wait for upload to complete by searching for rows to be present on page
    const reUploadTable = page.locator("[role='row']");
    await reUploadTable.first().isVisible();

    // 8. Assert Mange has correct price
    const itemSearch =  page.getByText(textSearch);
    const updatedPrice = await page.getByRole('row').filter({has: itemSearch}).textContent();
    // console.log(typeof(updatedPrice));
    console.log(updatedPrice);

    //the type of is string for updatePrice but the price we passed was numerical value SO cast it so STRING below
    expect(updatedPrice).toContain(String(modifiedPrice));
    
})

//go to any url via bypassing login above (MUST COME AFTER)
async function goToURL(page, url) {
  try {
    await page.goto(url);
  } catch (error) {
    console.error(`❌ Failed to navigate to URL: ${url}`);
    throw error;
  }
}


async function readExcel(testWorkSheet, searchText) {

    try{
        let output = {row:-1, column:-1};

        //print out each row
            //first we have rows, the X axis going left to right for each column
        testWorkSheet.eachRow((row, rowNumber) => {
            //iterates all over non null rows (with no information)
            //second we have the y, the cells in each row, left to right top tp bottom for each cell
            row.eachCell((cell, colNumber) => {
                //console.log(cell.value);
                if(cell.value === searchText) {

                    console.log(rowNumber, colNumber);
                    output.row = rowNumber;
                    output.column = colNumber;
                        
                }
            });
        });

        console.log(output);
        return output;
        
    } catch (error) {
        console.error(error.stack);
    }
    
}


async function writeExcel(searchText, replaceText = null, changeObject, updatePrice, filePath) {

    try{
        //grab a hold of a cell 'apple' from above and replace it with iPhone
        const output = await readExcel(testWorkSheet, searchText);

        //returned from outputput object from readExcel
            //{ row: 3, column: 2 }
        
        //if you want to update price only
        let myCell;
        if(replaceText !== "") {
            myCell = testWorkSheet.getCell(output.row, output.column);
            myCell.value = replaceText;
        }

        //if you want to update price only
        if(Object.keys(changeObject).length > 0 & updatePrice != "") {
            myCell = testWorkSheet.getCell(output.row, output.column+changeObject.colChange);
            myCell.value = updatePrice;
        }

        await workBook.xlsx.writeFile(filePath);

    } catch (error) {
        console.error(error.stack);
    }
   
}


