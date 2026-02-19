const express = require("express");
const router = express.Router();
const productService = require("../services/productService");
const {
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");

// GET all products
router.get("/products", async (req, res) => {
  const products = await productService.getAllProducts(req.db);
  res.json(products);
});

router.get("/", async (req, res) => {
  const products = await productService.getAllProducts(req.db);
  res.json(products);
});

router.get("/:id/image", (req, res) => {
  try {
    const { id } = req.params;

    const blobName = id + ".png";
    if (!blobName) {
      return res.status(404).send("Product image not found");
    }

    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = req.blobSecret;
    const containerName = process.env.AZURE_CONTAINER_NAME;

    const sharedKeyCredential = new StorageSharedKeyCredential(
      accountName,
      accountKey,
    );
    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName,
        identifier: "read-policy",
      },
      sharedKeyCredential,
    ).toString();
    const url = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
    res.json({ url });
  } catch (error) {
    console.error("Error sending image:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
