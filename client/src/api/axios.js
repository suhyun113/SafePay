import axios from "axios";
import { useAppStore } from "../store/useAppStore";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // 토큰 만료 → 강제 로그아웃
      localStorage.removeItem("access");
      useAppStore.getState().logout();
    }
    return Promise.reject(err);
  }
);

export default api;
