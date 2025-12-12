import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import api from "../api/axios";
import "../style/dashboard.css";

// Chart.js에서 사용할 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // 최초 렌더링 시 통계 조회
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("access");

      // 인증되지 않은 경우 통계 접근 차단
      if (!token) {
        alert("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      const res = await api.get("/security/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats(res.data);
    } catch (err) {
      // 통계 조회 실패 시 빈 데이터로 처리
      setStats({
        attackTypes: [],
        dailyStats: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-container">로딩 중...</div>;
  }

  if (!stats) {
    return <div className="dashboard-container">통계 없음</div>;
  }

  // 공격 유형별 통계 데이터 (도넛 차트)
  const attackTypeData = {
    labels: stats.attackTypes.map(a => a.attack_type),
    datasets: [
      {
        label: "공격 시도 횟수",
        data: stats.attackTypes.map(a => Number(a.count)),
        backgroundColor: [
          "rgba(255,99,132,0.6)",
          "rgba(54,162,235,0.6)",
          "rgba(255,206,86,0.6)",
          "rgba(75,192,192,0.6)",
        ],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h1>보안 통계 대시보드</h1>
      <Doughnut data={attackTypeData} />
    </div>
  );
}
