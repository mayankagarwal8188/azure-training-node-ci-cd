import React from "react";

interface OrderViewProps {
  orderId: string;
  status: string;
}

const OrderView: React.FC<OrderViewProps> = ({ orderId, status }) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>✅ Order Successful!</h2>
      <p style={styles.text}>
        <strong>Order ID:</strong> {orderId}
      </p>
      <p style={styles.text}>
        <strong>Status:</strong> {status}
      </p>
      <p style={styles.note}>Thank you for shopping with us! 🎉</p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "#f0fff4",
    border: "1px solid #38a169",
    borderRadius: "8px",
    padding: "20px",
    maxWidth: "400px",
    margin: "20px auto",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    color: "#2f855a",
    marginBottom: "10px",
  },
  text: {
    fontSize: "16px",
    margin: "5px 0",
  },
  note: {
    marginTop: "15px",
    fontStyle: "italic",
    color: "#4a5568",
  },
};

export default OrderView;
