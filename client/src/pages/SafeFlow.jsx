import api from "../api/axios";

export default function SafeFlow() {
  const handlePay = async () => {
    const res = await api.post("/payment/create", {
      item: "dummy",
      amount: 1000,
    });
    console.log(res.data);
  };

  return (
    <div>
      <h1>Safe Payment Flow</h1>
      <button onClick={handlePay}>Execute Payment</button>
    </div>
  );
}
