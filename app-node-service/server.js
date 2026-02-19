// Import required modules
const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const path = require("path");
const { SecretClient } = require("@azure/keyvault-secrets");
const { DefaultAzureCredential } = require("@azure/identity");

const sql = require("mssql");

const config = require("./config/db");
const app = express();
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    const isAzure =
      !!process.env.WEBSITE_INSTANCE_ID ||
      !!process.env.FUNCTIONS_WORKER_RUNTIME;
    let dbSecret;
    let blobSecret;
    if (isAzure) {
      const credential = new DefaultAzureCredential();
      const keyVaultName = process.env.AZURE_KEY_VAULT_NAME;
      const url = `https://${keyVaultName}.vault.azure.net`;
      const client = new SecretClient(url, credential);
      const dbSecretObject = await client.getSecret("db-cs");
      const blobSecretObject = await client.getSecret("blob-cs");
      dbSecret = dbSecretObject?.value;
      blobSecret = blobSecretObject?.value;
    } else {
      dbSecret = process.env.DB_PASSWORD;
      blobSecret = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    }
    config["password"] = dbSecret;
    const pool = await sql.connect(config);
    console.log("✅ Connected to SQL Server");

    // Pass DB to routes via middleware
    app.use((req, res, next) => {
      req.db = pool;
      req.blobSecret = blobSecret;
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
