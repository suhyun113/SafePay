import { create } from 'zustand';

export const useAppStore = create((set) => ({
    attackType: null,
    logs: [],

    // 로그인 상태
    isLoggedIn: !!localStorage.getItem("access"),

    // 상태 변경 함수
    setAttackType: (type) => set({ attackType: type }),
    addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),

    // 로그인 / 로그아웃 함수
    login: () => set({ isLoggedIn: true }),
    logout: () => {
        localStorage.removeItem("access");
        set({ isLoggedIn: false });
    }
}));
