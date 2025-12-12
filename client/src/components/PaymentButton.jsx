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
  // 로그 기록용 현재 시각 생성
  const now = () => new Date().toLocaleTimeString();

  const handlePay = async () => {
    // 상품이 선택되지 않은 경우 요청 차단
    if (!product) return alert("상품 선택 필요");

    // Access Token이 없는 경우 로그인 요구
    const token = localStorage.getItem("access");
    if (!token) return alert("로그인 필요");

    // 서버로 전송할 결제 요청 payload 구성
    const payload = {
      item: product.name,      // 서버 기준 상품 식별자
      ...security,             // 서명, nonce, timestamp 사용 여부
      attackEnabled,           // 공격 시뮬레이션 활성화 여부
      attackType: attackEnabled ? attackType : null,
    };

    try {
      // 결제 요청 API 호출 (Authorization 헤더로 Access Token 전달)
      const res = await api.post("/payment/checkout", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 성공 결과를 로그에 추가
      setLogs((prev) => [
        { time: now(), success: res.data.success, data: res.data },
        ...prev,
      ]);
    } catch (err) {
      // 실패 또는 공격 차단 결과를 로그에 추가
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
