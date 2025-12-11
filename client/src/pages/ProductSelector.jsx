import { useEffect, useState } from "react";
import api from "../api/axios";
import "../style/product.css";

export default function ProductSelector({ onSelect }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/shop/products")
      .then((res) => setProducts(res.data.products))
      .catch(() => alert("상품을 불러오지 못했습니다."));
  }, []);

  return (
    <div className="product-selector">
      {products.map((p) => (
        <button key={p.id} className="product-btn" onClick={() => onSelect(p)}>
          {p.name} - {p.price}원
        </button>
      ))}
    </div>
  );
}
