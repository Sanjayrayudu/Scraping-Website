const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeWebsite() {
  const url = 'https://www.nobroker.in/flats-for-sale-in-koramangala_bangalore';

  try {
    
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const listingArticles = $('article[aria-label="article"]');
    const listings = [];
    listingArticles.each((index, element) => {
      const article = $(element);
      const area = article.find('h2 a').text();
      const url = article.find('h2 a').attr('href');
      const propertyAgeMatch = url.match(/\/(\d+)-bhk-/);
      const propertyAge = propertyAgeMatch ? propertyAgeMatch[1] : null;
      listings.push({ area, url, propertyAge });
    });
    console.log(listings);
  } catch (error) {
    console.error(`Error fetching website: ${error}`);
  }
}

scrapeWebsite();
