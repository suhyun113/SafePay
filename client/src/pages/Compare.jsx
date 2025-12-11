import { useState } from "react";
import SafeFlow from "./SafeFlow";
import AttackFlow from "./AttackFlow";
import ProductSelector from "./ProductSelector";
import "../style/layout.css";

export default function Compare() {
  const [product, setProduct] = useState(null);

  return (
    <div className="compare-wrapper">

      <div className="selector-box">
        <ProductSelector onSelect={setProduct} />
      </div>

      <div className="dual-wrapper">
        <div className="panel left-panel">
          <h2>Safe Flow</h2>
          <SafeFlow product={product} />
        </div>

        <div className="panel right-panel">
          <h2>Attack Flow</h2>
          <AttackFlow product={product} />
        </div>
      </div>

    </div>
  );
}
