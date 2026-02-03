// Import required modules
const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const path = require("path");

const sql = require("mssql");

const config = require("./config/db");
const app = express();
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    const pool = await sql.connect(config);
    console.log("✅ Connected to SQL Server");

    // Pass DB to routes via middleware
    app.use((req, res, next) => {
      req.db = pool;
      next();
    });

    // Routes
    app.use(cors()); // Enables CORS for all origins

    // Middleware to parse JSON
    app.use(express.json());

    // Register routes
    app.use("/api/products", productRoutes);

    app.use(express.static(path.join(__dirname, "public")));
    app.get(/^\/(?!api).*/, (req, res) => {
      res.sendFile(path.join(__dirname, "public", "index.html"));
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running at ${PORT}`);
    });
  } catch (err) {
    console.error("❌ connection error:", err.message);
    process.exit(1);
  }
}

startServer();
