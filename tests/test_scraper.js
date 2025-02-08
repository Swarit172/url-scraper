const { scrapeMetadata } = require("../utils/scraper");

test("Scrapes metadata from a valid URL", async () => {
    const metadata = await scrapeMetadata("https://example.com");
    expect(metadata).toHaveProperty("title");
});
