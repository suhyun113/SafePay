import { useState } from "react";
import ProductSelector from "./ProductSelector";
import SafeFlow from "./SafeFlow";
import AttackFlow from "./AttackFlow";
import "../style/layout.css";

export default function Compare() {
  const [product, setProduct] = useState(null);

  return (
    <div className="compare-container">

      <h2 className="compare-title">상품 선택</h2>
      <ProductSelector onSelect={setProduct} />

      <div className="compare-panels">
        <div className="panel safe-panel">
          <h3>Safe Flow</h3>
          <SafeFlow product={product} />
        </div>

        <div className="panel attack-panel">
          <h3>Attack Flow</h3>
          <AttackFlow product={product} />
        </div>
      </div>
    </div>
  );
}
