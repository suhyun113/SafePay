import { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, PointElement, LineElement } from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import api from "../api/axios";
import "../style/dashboard.css";

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

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        alert("로그인이 필요합니다.");
        setLoading(false);
        return;
      }
      
      const res = await api.get("/security/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.error) {
        console.warn("Stats API returned error:", res.data.error);
      }
      
      console.log("Fetched stats:", res.data);
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      const errorMsg = err.response?.data?.message || err.message || "통계를 불러오는데 실패했습니다.";
      console.error("Error details:", errorMsg);
      
      // 에러가 발생해도 기본값으로 표시
      setStats({
        rateLimitBlocks: 0,
        csrfBlocks: 0,
        hijackingAttempts: 0,
        attackTypes: [],
        dailyStats: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="dashboard-container">
        <div className="error">통계 데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  // 방어 통계 차트 데이터
  const defenseData = {
    labels: ["Rate-Limit 차단", "CSRF 공격 차단", "하이재킹 시도 차단"],
    datasets: [
      {
        label: "차단 횟수",
        data: [
          stats.rateLimitBlocks || 0,
          stats.csrfBlocks || 0,
          stats.hijackingAttempts || 0,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // 공격 유형별 통계
  const attackTypeData = {
    labels: stats.attackTypes?.map((a) => a.attack_type) || [],
    datasets: [
      {
        label: "공격 시도 횟수",
        data: stats.attackTypes?.map((a) => Number(a.count) || 0) || [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // 일별 통계 데이터 준비
  const dailyDataMap = {};
  stats.dailyStats?.forEach((stat) => {
    const date = stat.date ? String(stat.date).split('T')[0] : null;
    if (date) {
      if (!dailyDataMap[date]) {
        dailyDataMap[date] = { RATE_LIMIT: 0, HIJACKING: 0 };
      }
      dailyDataMap[date][stat.log_type] = Number(stat.count) || 0;
    }
  });

  const dates = Object.keys(dailyDataMap).sort();
  const dailyData = {
    labels: dates.length > 0 ? dates : ['데이터 없음'],
    datasets: [
      {
        label: "Rate-Limit 차단",
        data: dates.length > 0 
          ? dates.map((date) => Number(dailyDataMap[date].RATE_LIMIT) || 0)
          : [0],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
      },
      {
        label: "하이재킹 시도",
        data: dates.length > 0
          ? dates.map((date) => Number(dailyDataMap[date].HIJACKING) || 0)
          : [0],
        borderColor: "rgba(255, 206, 86, 1)",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        font: {
          size: 16,
        },
      },
    },
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">보안 통계 대시보드</h1>

      <div className="stats-summary">
        <div className="stat-card">
          <div className="stat-value">{stats.rateLimitBlocks || 0}</div>
          <div className="stat-label">Rate-Limit 차단</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.csrfBlocks || 0}</div>
          <div className="stat-label">CSRF 공격 차단</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.hijackingAttempts || 0}</div>
          <div className="stat-label">하이재킹 시도 차단</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h2>보안 미들웨어 방어 통계</h2>
          <div className="chart-wrapper">
            <Bar data={defenseData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h2>공격 유형별 통계</h2>
          <div className="chart-wrapper">
            {stats.attackTypes?.length > 0 ? (
              <Doughnut data={attackTypeData} options={chartOptions} />
            ) : (
              <div className="no-data">데이터가 없습니다.</div>
            )}
          </div>
        </div>

        <div className="chart-card full-width">
          <h2>최근 7일간 보안 이벤트 추이</h2>
          <div className="chart-wrapper">
            {dates.length > 0 ? (
              <Line data={dailyData} options={chartOptions} />
            ) : (
              <div className="no-data">데이터가 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
