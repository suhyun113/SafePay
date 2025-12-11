import { useState } from "react";
import SafeFlow from "./SafeFlow";
import AttackFlow from "./AttackFlow";
import ProductSelector from "./ProductSelector";
import "../style/layout.css";

export default function Compare() {
  const [product, setProduct] = useState(null);

  return (
    <div className="compare-wrapper">
      <h2 className="compare-title">상품 선택</h2>

      {/* 상품 선택 UI */}
      <ProductSelector onSelect={(p) => setProduct(p)} />

      <div className="dual-wrapper">
        
        {/* SAFE FLOW PANEL */}
        <div className="panel left-panel">
          <h2>Safe Flow</h2>
          <SafeFlow product={product} />
        </div>

        {/* ATTACK FLOW PANEL */}
        <div className="panel right-panel">
          <h2>Attack Flow</h2>
          <AttackFlow product={product} />
        </div>

      </div>
    </div>
  );
}
