const express = require("express");
const ScrapeTask = require("../models/ScrapeTask");

const router = express.Router();

router.get("/results/:id", async (req, res) => {
    const task = await ScrapeTask.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Metadata not found" });

    res.json(task.metadata);
});

module.exports = router;
