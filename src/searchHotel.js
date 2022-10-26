const puppeteer = require('puppeteer');

let arr = [0]

const searchHotel = async (searchQuery) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });

  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }

  const page = await browser.newPage();

  console.log('searching');

  await page.setRequestInterception(true);

  page.on('request', (request) => {
    if (
      request.resourceType() === 'image' ||
      request.resourceType() === 'Script' ||
      request.resourceType() === 'Font'
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });
  await page.goto('https://www.agoda.com/?cid=1905113');

  await page.type(
    'input[class="SearchBoxTextEditor SearchBoxTextEditor--autocomplete"]',
    searchQuery.hotel_name,
  );

  await delay(500);

  await page.$eval(
    'button[class="Buttonstyled__ButtonStyled-sc-5gjk6l-0 hvHHEO Box-sc-kv6pi1-0 fDMIuA"]',
    (button) => button.click(),
  );

  await page.waitForSelector(
    'h3[class="PropertyCard__HotelName"], h3[class="sc-eCssSg sc-jSgupP jLfNmR fSXLsY"]',
    searchQuery.hotel_name,
  );

  const searching = await page.$(
    'h3[class="PropertyCard__HotelName"], h3[class="sc-eCssSg sc-jSgupP jLfNmR fSXLsY"]',
    searchQuery.hotel_name,
  );

  if (searching === null) {
    return console.log('No hotel exist with this name, try another');
  }

  const [target] = await Promise.all([
    new Promise((resolve) => browser.once('targetcreated', resolve)),
    searching.click({ button: 'middle' }),
  ]);

  const newPage = await target.page();
  await newPage.bringToFront();

  await newPage.setRequestInterception(true);

  newPage.on('request', (request) => {
    if (
      request.resourceType() === 'image' ||
      request.resourceType() === 'Script' ||
      request.resourceType() === 'Font'
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });

  await newPage.waitForSelector(
    'button[class="btn btn-primary StickyNavPrice__button"]',
  );

  const moneyButton = await newPage.$eval(
    'button[class="btn btn-primary StickyNavPrice__button"]',
    (button) => button.click(),
  );

  if (moneyButton === null) {
    return console.log('No rooms are available');
  }

  // await delay(300);

  const moneyResults = await newPage.$$eval(
    'div[class=PriceContainer]',
    (results) => {
      let data = [];
      results.forEach((parent) => {
        const ele = parent.querySelector('h1');
        if (ele === null) {
          return;
        }
        console.log('ele===', ele);

        let gCount = parent.querySelectorAll(
          'span[class="Spanstyled__SpanStyled-sc-16tp9kb-0 gwICfd kite-js-Span pd-price PriceDisplay PriceDisplay--noPointer PriceDisplay pd-color"]',
        );
        gCount.forEach((result) => {
          const price = result.querySelector('strong').innerHTML;

          data.push({ price });
        });
      });
      return data;
    },
  );

  let onlyprice = moneyResults.map((a) => a.price);

  const min = Math.min(...onlyprice);
  console.log('Lowest price of a room= €', min)

  arr.fill({price: min})
  console.log('arr===', arr);

    await browser.close();
};


module.exports = {searchHotel, arr};
