import axios from "axios";
import { useAppStore } from "../store/useAppStore";

// 모든 API 요청에 공통으로 사용되는 Axios 인스턴스 생성
const api = axios.create({
  baseURL: "/api",            // 백엔드 API의 공통 prefix
  withCredentials: true,      // 쿠키 기반 인증(refresh token) 허용
});

// 응답 인터셉터: 인증 오류 발생 시 전역 처리
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Access Token 만료 또는 인증 실패 시
    if (err.response?.status === 401) {
      // 로컬 스토리지에 저장된 access token 제거
      localStorage.removeItem("access");

      // 전역 상태(Zustand)에서 로그아웃 처리
      useAppStore.getState().logout();
    }
    return Promise.reject(err);
  }
);

export default api;
