const express = require("express");
const multer = require("multer");
const csvParser = require("csv-parser");
const fs = require("fs");
const ScrapeTask = require("../models/ScrapeTask");
const { scrapeMetadata } = require("../utils/scraper");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("csvFile"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const urls = [];

    try {
        fs.createReadStream(req.file.path)
            .pipe(csvParser())
            .on("data", (row) => {
                if (row.url && row.url.trim()) {
                    urls.push(row.url.trim());
                }
            })
            .on("end", async () => {
                fs.unlinkSync(req.file.path); // Delete CSV file after processing

                if (urls.length === 0) {
                    return res.status(400).json({ error: "CSV file is empty or contains invalid URLs" });
                }

                console.log("Parsed URLs:", urls);

                // Store tasks in MongoDB
                const tasks = await ScrapeTask.insertMany(
                    urls.map((url) => ({ url, status: "pending", metadata: {} }))
                );

                console.log("Stored tasks in DB:", tasks.map(t => t._id));

                // Start Scraping in Background (Without Redis)
                await Promise.all(tasks.map(async (task) => {
                    try {
                        const metadata = await scrapeMetadata(task.url);
                        await ScrapeTask.findByIdAndUpdate(task._id, {
                            status: metadata ? "completed" : "failed",
                            metadata,
                        });
                        console.log(`Scraped: ${task.url}`);
                    } catch (error) {
                        console.error(`Error scraping ${task.url}:`, error.message);
                        await ScrapeTask.findByIdAndUpdate(task._id, { status: "failed" });
                    }
                }));

                res.json({ message: "Scraping started", taskIds: tasks.map((t) => t._id) });
            });

    } catch (error) {
        console.error("Error processing CSV:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
