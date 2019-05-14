const puppeteer = require('puppeteer');
const url = 'https://skyxe.ca/en-us/flight-info/departures';
const $ = require('cheerio');
const fs = require('fs');
const destinationSelector = 'td:nth-child(4)';
const tomorrowSelector = '#dnn_dnnTEXTTomorrow_lblText'
const YXEDestinations = {
    "Cities": []
}

const uniqueSet = new Set();
puppeteer.launch().then(async browser => {
    const page = await browser.newPage();
    await page.goto(url);
    let html = await page.content();
    await addToSet(destinationSelector,uniqueSet,html)
    await page.click(tomorrowSelector)
    html = await page.content();
    await addToSet(destinationSelector,uniqueSet,html)
    YXEDestinations.Cities = await [...uniqueSet].sort();
       
    await fs.writeFile('YXEDestinations.json', JSON.stringify(YXEDestinations), function(err){
        if (err) throw err;
        console.log("Successfully Written to File.");
    });
    await browser.close();
});

const addToSet = async (selector,set,html)=>{
    await $(selector,html).each(function(i, elem) {
        if(set.has($(this).text()))return true;
         set.add($(this).text());
    })
}