const express = require("express");
const cors = require("cors");
require("dotenv").config();

// // Debug environment variables
// console.log("Environment check:");
// console.log("COGNODB_URI:", process.env.COGNODB_URI ? "SET" : "NOT SET");
// console.log("COGNODB_USER:", process.env.COGNODB_USER ? "SET" : "NOT SET");
// console.log("COGNODB_PASSWORD:", process.env.COGNODB_PASSWORD ? "SET" : "NOT SET");

const { verifyConnection } = require("./config/db");
const careerRoutes = require("./routes/career");
const graphRoutes = require("./routes/graph");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", careerRoutes);
app.use(graphRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "CareerGraph API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  await verifyConnection();
});