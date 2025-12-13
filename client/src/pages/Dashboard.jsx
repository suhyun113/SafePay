import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
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

/* Chart.js에서 사용할 차트 요소 등록 */
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [stats, setStats] = useState({ attackTypes: [], dailyStats: [] });
  const [loading, setLoading] = useState(true);

  /* 페이지 최초 진입 시 보안 통계 조회 */
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("access");
      /* 인증 토큰이 없으면 통계 접근 차단 */
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const res = await api.get("/security/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats(res.data || { attackTypes: [], dailyStats: [] });
    } catch {
      setStats({ attackTypes: [], dailyStats: [] });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-container">로딩 중...</div>;
  }

  /* =========================
     Doughnut (공격 유형별)
  ========================= */
  const hasAttackTypes = stats.attackTypes.length > 0;

  const attackTypeData = {
    labels: hasAttackTypes
      ? stats.attackTypes.map(a => a.attack_type)
      : ["데이터 없음"],
    datasets: [
      {
        label: "공격 시도 횟수",
        data: hasAttackTypes
          ? stats.attackTypes.map(a => Number(a.count))
          : [1],
        backgroundColor: hasAttackTypes
          ? [
              "rgba(255,99,132,0.6)",
              "rgba(54,162,235,0.6)",
              "rgba(255,206,86,0.6)",
              "rgba(75,192,192,0.6)",
              "rgba(153,102,255,0.6)"
            ]
          : ["#ddd"],
        borderWidth: 2
      }
    ]
  };

  /* =========================
     Line (최근 7일 공격 추이)
  ========================= */
  const dailyDataMap = {};

  stats.dailyStats.forEach(stat => {
    const date = stat.date ? String(stat.date).split("T")[0] : null;
    if (!date) return;

    if (!dailyDataMap[date]) dailyDataMap[date] = {};

    const type = stat.attack_type || stat.log_type;
    dailyDataMap[date][type] = Number(stat.count) || 0;
  });

  const dates = Object.keys(dailyDataMap).sort();
  const attackKeys = Array.from(
    new Set(stats.dailyStats.map(s => s.attack_type || s.log_type))
  );

  const hasDailyData = dates.length > 0 && attackKeys.length > 0;

  const dailyData = {
    labels: hasDailyData ? dates : ["데이터 없음"],
    datasets: hasDailyData
      ? attackKeys.map((key, idx) => ({
          label: key,
          data: dates.map(d => dailyDataMap[d]?.[key] || 0),
          borderColor: [
            "#e63946",
            "#457b9d",
            "#2a9d8f",
            "#7209b7"
          ][idx % 4],
          backgroundColor: "transparent",
          tension: 0.4
        }))
      : [
          {
            label: "공격 없음",
            data: [0],
            borderColor: "#ccc"
          }
        ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" }
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">보안 통계 대시보드</h1>

      <div className="charts-grid">
        <div className="chart-card">
          <h2>공격 유형별 통계</h2>
          <div className="chart-wrapper donut-center">
            <Doughnut data={attackTypeData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card full-width">
          <h2>최근 7일간 공격 추이</h2>
          <div className="chart-wrapper">
            <Line data={dailyData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
