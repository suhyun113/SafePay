import { useEffect, useState } from "react";
import api from "../api/axios";
import "../style/logs.css";

export default function Logs() {
  const [activeTab, setActiveTab] = useState("security"); // security, attack, audit
  const [securityLogs, setSecurityLogs] = useState([]);
  const [attackLogs, setAttackLogs] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 50;

  useEffect(() => {
    fetchLogs();
  }, [activeTab, page]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        alert("로그인이 필요합니다.");
        setLoading(false);
        return;
      }
      
      const headers = { Authorization: `Bearer ${token}` };

      if (activeTab === "security") {
        const res = await api.get(`/security/logs?page=${page}&limit=${limit}`, { headers });
        setSecurityLogs(res.data.logs || []);
        setTotal(res.data.total || 0);
      } else if (activeTab === "attack") {
        const res = await api.get(`/security/attack-logs?page=${page}&limit=${limit}`, { headers });
        setAttackLogs(res.data.logs || []);
        setTotal(res.data.total || 0);
      } else if (activeTab === "audit") {
        const res = await api.get(`/security/audit-logs?page=${page}&limit=${limit}`, { headers });
        setAuditLogs(res.data.logs || []);
        setTotal(res.data.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch logs:", err);
      const errorMsg = err.response?.data?.message || err.message || "로그를 불러오는데 실패했습니다.";
      console.error("Error details:", errorMsg);
      
      // 에러가 발생해도 빈 배열로 설정
      if (activeTab === "security") {
        setSecurityLogs([]);
        setTotal(0);
      } else if (activeTab === "attack") {
        setAttackLogs([]);
        setTotal(0);
      } else if (activeTab === "audit") {
        setAuditLogs([]);
        setTotal(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR");
  };

  const getLogTypeBadge = (type) => {
    const colors = {
      RATE_LIMIT: "#e76f51",
      HIJACKING: "#f77f00",
      CSRF: "#e63946",
      Replay: "#457b9d",
      "Price Tampering": "#2a9d8f",
      "Signature Tampering": "#7209b7",
    };
    return (
      <span
        className="log-type-badge"
        style={{ backgroundColor: colors[type] || "#666" }}
      >
        {type}
      </span>
    );
  };

  const renderSecurityLogs = () => {
    if (loading) return <div className="loading">로딩 중...</div>;
    if (securityLogs.length === 0)
      return <div className="no-data">보안 로그가 없습니다.</div>;

    return (
      <div className="logs-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>유형</th>
              <th>상세</th>
              <th>IP 주소</th>
              <th>발생 시간</th>
            </tr>
          </thead>
          <tbody>
            {securityLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{getLogTypeBadge(log.log_type)}</td>
                <td>{log.detail}</td>
                <td>{log.ip_address || "-"}</td>
                <td>{formatDate(log.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderAttackLogs = () => {
    if (loading) return <div className="loading">로딩 중...</div>;
    if (attackLogs.length === 0)
      return <div className="no-data">공격 로그가 없습니다.</div>;

    return (
      <div className="logs-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>공격 유형</th>
              <th>상세</th>
              <th>결과</th>
              <th>발생 시간</th>
            </tr>
          </thead>
          <tbody>
            {attackLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{getLogTypeBadge(log.attack_type)}</td>
                <td>{log.detail}</td>
                <td>
                  <span className={log.success ? "success" : "failed"}>
                    {log.success ? "성공" : "차단"}
                  </span>
                </td>
                <td>{formatDate(log.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderAuditLogs = () => {
    if (loading) return <div className="loading">로딩 중...</div>;
    if (auditLogs.length === 0)
      return <div className="no-data">감사 로그가 없습니다.</div>;

    return (
      <div className="logs-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>IP</th>
              <th>메서드</th>
              <th>경로</th>
              <th>상태</th>
              <th>시간</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.ip || "-"}</td>
                <td>
                  <span className={`method-badge method-${log.method?.toLowerCase()}`}>
                    {log.method || "-"}
                  </span>
                </td>
                <td className="path-cell">{log.path || "-"}</td>
                <td>
                  <span className={`status-badge status-${log.status}`}>
                    {log.status || "-"}
                  </span>
                </td>
                <td>{log.timestamp || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="logs-container">
      <h1 className="logs-title">로그 조회</h1>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "security" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("security");
            setPage(1);
          }}
        >
          보안 로그
        </button>
        <button
          className={`tab ${activeTab === "attack" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("attack");
            setPage(1);
          }}
        >
          공격 로그
        </button>
        <button
          className={`tab ${activeTab === "audit" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("audit");
            setPage(1);
          }}
        >
          감사 로그
        </button>
      </div>

      <div className="logs-content">
        {activeTab === "security" && renderSecurityLogs()}
        {activeTab === "attack" && renderAttackLogs()}
        {activeTab === "audit" && renderAuditLogs()}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            이전
          </button>
          <span>
            페이지 {page} / {totalPages} (총 {total}개)
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}

