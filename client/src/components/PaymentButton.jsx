import api from "../api/axios";
import "../style/payment.css";

export default function PaymentButton({
  product,
  security,
  attackEnabled,
  attackType,
  logs,
  setLogs,
}) {
  const now = () => new Date().toLocaleTimeString();

  const handlePay = async () => {
    if (!product) return alert("상품 선택 필요");

    const token = localStorage.getItem("access");
    if (!token) return alert("로그인 필요");

    const payload = {
      item: product.name,
      ...security,
      attackEnabled,
      attackType: attackEnabled ? attackType : null,
    };

    try {
      const res = await api.post("/payment/checkout", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLogs((prev) => [
        { time: now(), success: res.data.success, data: res.data },
        ...prev,
      ]);
    } catch (err) {
      setLogs((prev) => [
        {
          time: now(),
          success: false,
          data: err.response?.data || err.message,
        },
        ...prev,
      ]);
    }
  };

  return (
    <div className="payment-bar">
      <button className="pay-btn" onClick={handlePay}>
        보안 결제 요청
      </button>
    </div>
  );
}
