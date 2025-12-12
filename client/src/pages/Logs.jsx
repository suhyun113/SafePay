import { useEffect, useState } from "react";
import api from "../api/axios";
import "../style/logs.css";

export default function Logs() {
  // 현재 선택된 로그 탭 상태
  const [activeTab, setActiveTab] = useState("security");

  // 로그 데이터 상태
  const [securityLogs, setSecurityLogs] = useState([]);
  const [attackLogs, setAttackLogs] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // 페이지네이션 상태
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 50;

  useEffect(() => {
    fetchLogs();
  }, [activeTab, page]);

  const fetchLogs = async () => {
    const token = localStorage.getItem("access");
    if (!token) return alert("로그인이 필요합니다.");

    const headers = { Authorization: `Bearer ${token}` };

    if (activeTab === "security") {
      const res = await api.get(`/security/logs?page=${page}&limit=${limit}`, { headers });
      setSecurityLogs(res.data.logs || []);
      setTotal(res.data.total || 0);
    }

    if (activeTab === "attack") {
      const res = await api.get(`/security/attack-logs?page=${page}&limit=${limit}`, { headers });
      setAttackLogs(res.data.logs || []);
      setTotal(res.data.total || 0);
    }

    if (activeTab === "audit") {
      const res = await api.get(`/security/audit-logs?page=${page}&limit=${limit}`, { headers });
      setAuditLogs(res.data.logs || []);
      setTotal(res.data.total || 0);
    }
  };

  return (
    <div className="logs-container">
      <h1>로그 조회</h1>

      <div className="tabs">
        <button onClick={() => setActiveTab("security")}>보안 로그</button>
        <button onClick={() => setActiveTab("attack")}>공격 로그</button>
        <button onClick={() => setActiveTab("audit")}>감사 로그</button>
      </div>
    </div>
  );
}
