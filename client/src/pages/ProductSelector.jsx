import { useEffect, useState } from "react";
import api from "../api/axios";
import "../style/product.css";

export default function ProductSelector({ onSelect }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/shop/products");
        console.log("상품 목록:", res.data.products);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("상품 불러오기 실패:", err);
        alert("상품을 불러오지 못했습니다: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSelect = (product) => {
    console.log("상품 선택:", product);
    setSelectedProduct(product);
    onSelect(product);
  };

  if (loading) {
    return <div className="product-selector">상품을 불러오는 중...</div>;
  }

  if (products.length === 0) {
    return <div className="product-selector">상품이 없습니다.</div>;
  }

  return (
    <div className="product-selector">
      {products.map((p) => (
        <button
          key={p.id}
          className={`product-btn ${selectedProduct?.id === p.id ? "selected" : ""}`}
          onClick={() => handleSelect(p)}
        >
          {p.name} - {p.price}원
        </button>
      ))}
      {selectedProduct && (
        <div style={{ marginTop: "10px", color: "#2a9d8f", fontWeight: "600" }}>
          선택됨: {selectedProduct.name}
        </div>
      )}
    </div>
  );
}
