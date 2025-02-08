const mongoose = require("mongoose");

const ScrapeTaskSchema = new mongoose.Schema({
    url: { type: String, required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    metadata: {
        title: String,
        description: String,
        keywords: String,
    },
}, { timestamps: true });

module.exports = mongoose.model("ScrapeTask", ScrapeTaskSchema);
