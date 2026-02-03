import React, { useEffect, useRef, useState } from "react";
import OrderView from "./OrderView";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

interface OrderResponse {
  orderId: string;
  status: string;
}

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    // Fetch products from API
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/products`,
        );

        // Handle HTTP errors
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading products...</p>;
  }

  if (error) {
    return <p style={{ padding: "20px", color: "red" }}>Error: {error}</p>;
  }

  const downloadProductImage = async (id: number) => {
    try {
      const response = await fetch(`/api/products/${id}/image`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id ? { ...product, image: data.url } : product,
        ),
      );
    } catch (error) {
      console.error("Image download failed:", error);
    }
  };

  const orderProduct = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_AZURE_FUNCTION_URL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId: id }),
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error order failed! Status: ${response.status}`);
      }
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error("Order Failed:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div>
        <h1>Welcome to the Products Page</h1>
        <p style={{ color: "blue" }}>
          Use the <span style={{ fontWeight: "bold" }}>Load Product Image</span>{" "}
          button to load the product image from{" "}
          <span style={{ fontWeight: "bold" }}>Blob Storage</span> and{" "}
          <span style={{ fontWeight: "bold" }}>Order</span> button to buy the
          product.
        </p>
      </div>
      {order?.orderId && order.status === "success" && (
        <OrderView orderId={order?.orderId} status={order?.status} />
      )}
      {order?.status === "error" && (
        <p style={{ color: "red" }}>❌ Order failed</p>
      )}
      <h1>Products</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {products.map((product) => (
          <li
            key={product.id}
            style={{
              border: "1px solid #ccc",
              marginBottom: "10px",
              padding: "10px",
              borderRadius: "5px",
              background: "white",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h3>{product.title}</h3>
              <div
                style={{
                  display: "flex",
                  marginRight: "10px",
                  cursor: "pointer",
                  color: "blue",
                }}
              >
                <div
                  onClick={() => downloadProductImage(product.id)}
                  style={{ marginRight: "15px", textDecoration: "underline" }}
                >
                  Load Product Image
                </div>
                <div
                  onClick={() => orderProduct(product.id)}
                  style={{ marginRight: "15px", textDecoration: "underline" }}
                >
                  Order
                </div>
              </div>
            </div>
            <img
              src={product.image}
              alt={product.title}
              style={{ width: "100px", height: "100px", objectFit: "contain" }}
            />
            <p>${product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductsPage;
