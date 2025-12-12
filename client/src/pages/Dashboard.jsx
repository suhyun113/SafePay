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
  const [stats, setStats] = useState(null);
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
        setLoading(false);
        return;
      }

      const res = await api.get("/security/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats(res.data);
    } catch (err) {
      /* 통계 조회 실패 시에도 화면이 깨지지 않도록 기본값 설정 */
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
    return <div className="dashboard-container">통계 데이터 없음</div>;
  }

  /* =========================
     공격 유형별 통계 (Doughnut)
     DB의 attack_logs 테이블 기반
  ========================= */
  const attackTypeData = {
    labels: stats.attackTypes.map(a => a.attack_type),
    datasets: [
      {
        label: "공격 시도 횟수",
        data: stats.attackTypes.map(a => Number(a.count)),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)"
        ],
        borderWidth: 2
      }
    ]
  };

  /* =========================
     최근 7일간 공격 추이 (Line)
     날짜 + 공격 유형별 집계
  ========================= */
  const dailyDataMap = {};

  stats.dailyStats.forEach(stat => {
    const date = stat.date ? String(stat.date).split("T")[0] : null;
    if (!date) return;

    if (!dailyDataMap[date]) {
      dailyDataMap[date] = {};
    }

    dailyDataMap[date][stat.attack_type] = Number(stat.count) || 0;
  });

  const dates = Object.keys(dailyDataMap).sort();
  const attackKeys = stats.attackTypes.map(a => a.attack_type);

  const dailyData = {
    labels: dates.length > 0 ? dates : ["데이터 없음"],
    datasets: attackKeys.map((key, idx) => ({
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
