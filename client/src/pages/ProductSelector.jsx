import { useState, useEffect } from "react";
import api from "../api/axios";

export default function ProductSelector({ onSelect }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/payment/products")
      .then((res) => setProducts(res.data.products))
      .catch((err) => console.error("상품 로드 실패:", err));
  }, []);

  return (
    <div>
      <h3>상품 선택</h3>

      {products.map((p) => (
        <button key={p.id} onClick={() => onSelect(p)}>
          {p.name} - {p.price}원
        </button>
      ))}
    </div>
  );
}
