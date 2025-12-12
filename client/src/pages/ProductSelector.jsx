import { useEffect, useState } from "react";
import api from "../api/axios";
import "../style/product.css";
import { useAppStore } from "../store/useAppStore";

export default function ProductSelector({ onSelect }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 로그인 여부 확인
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);

  if (!isLoggedIn) {
    return (
      <div className="product-selector disabled">
        <p>🔒 로그인이 필요합니다.</p>
      </div>
    );
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/shop/products");
        setProducts(res.data.products || []);
      } catch (err) {
        alert("상품을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 상품 선택 처리
  const handleSelect = (product) => {
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
          className={`product-btn ${
            selectedProduct?.id === p.id ? "selected" : ""
          }`}
          onClick={() => handleSelect(p)}
        >
          {p.name} - {p.price}원
        </button>
      ))}

      {selectedProduct && (
        <div className="selected-product">
          선택됨: {selectedProduct.name}
        </div>
      )}
    </div>
  );
}
