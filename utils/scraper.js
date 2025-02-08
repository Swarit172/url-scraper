const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeMetadata(url) {
    try {
        const { data } = await axios.get(url, { timeout: 10000 });
        const $ = cheerio.load(data);

        // Extract metadata
        const title = $("title").text().trim() || null;
        const description =
            $('meta[name="description"]').attr("content")?.trim() ||
            $('meta[property="og:description"]').attr("content")?.trim() || null;
        const keywords =
            $('meta[name="keywords"]').attr("content")?.trim() ||
            $('meta[property="keywords"]').attr("content")?.trim() || null;

        console.log(`Scraped Data for ${url}:`, { title, description, keywords });

        return { title, description, keywords };
    } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        return null;
    }
}

module.exports = { scrapeMetadata };
