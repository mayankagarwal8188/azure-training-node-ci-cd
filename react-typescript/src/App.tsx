import React from "react";
import "./App.css";
import { Link, useNavigate } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

const App: React.FC = () => {
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/products");
  };
  return (
    <div>
      <nav style={{ padding: "10px" }}>
        <div
          className="logo"
          onClick={(e) => {
            e.preventDefault();
            handleLogoClick();
          }}
        >
          Azure Project
        </div>
        <ul id="menu">
          <li>
            <Link to="/products">Products</Link>
          </li>
        </ul>
      </nav>
      <AppRoutes />
    </div>
  );
};

export default App;
