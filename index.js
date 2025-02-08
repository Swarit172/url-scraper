const express = require("express");
const dotenv = require("dotenv");
require("./databases/db");

dotenv.config();

const uploadRoutes = require("./routes/upload");
const statusRoutes = require("./routes/status");
const resultsRoutes = require("./routes/results");

const app = express();
app.use(express.json());

app.use("/api", uploadRoutes);
app.use("/api", statusRoutes);
app.use("/api", resultsRoutes);

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
