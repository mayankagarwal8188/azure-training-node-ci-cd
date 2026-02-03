import { Route, Routes } from "react-router-dom";
import ProductsPage from "../pages/ProductsPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductsPage />} />
      <Route path="/products" element={<ProductsPage />} />
    </Routes>
  );
};

export default AppRoutes;
