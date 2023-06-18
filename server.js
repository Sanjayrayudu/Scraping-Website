const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeWebsite() {
  const url = 'https://www.nobroker.in/flats-for-sale-in-koramangala_bangalore';
  const targetListings = 84;
  const listings = [];

  try {
    let page = 1;
    let fetchedListings = 0;

    while (fetchedListings < targetListings) {
      const response = await axios.get(`${url}?page=${page}`);
      const html = response.data;
      const $ = cheerio.load(html);
      const listingArticles = $('article[aria-label="article"]');

      if (listingArticles.length === 0) {
        break;
      }

      listingArticles.each((index, element) => {
        const article = $(element);
        const area = article.find('h2 a').text();
        const url = article.find('h2 a').attr('href');
        const propertyAgeMatch = url.match(/\/(\d+)-bhk-/);
        const propertyAge = propertyAgeMatch ? propertyAgeMatch[1] : null;
  
        if (!area.includes('Koramangala')) {
          return;
        }
        
        listings.push({ area, url, propertyAge });
        fetchedListings++;

        if (fetchedListings >= targetListings) {
          return false;
        }
      });

      page++;
    }

    console.log('Total Listings:', listings.length);
    console.log(listings);
  } catch (error) {
    console.error(`Error fetching website: ${error}`);
  }
}

scrapeWebsite();
