const express = require("express");
const ScrapeTask = require("../models/ScrapeTask");

const router = express.Router();

router.get("/status/:id", async (req, res) => {
    const task = await ScrapeTask.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json(task);
});

module.exports = router;
