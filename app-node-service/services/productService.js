async function getAllProducts(pool) {
  try {
    const products = await pool.request().query("SELECT * FROM Products");
    return products.recordset;
  } catch (error) {
    throw new Error("Database query failed: " + error.message);
  }
}

module.exports = {
  getAllProducts,
};
