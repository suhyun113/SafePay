import { create } from 'zustand'; // 전역 상태 관리를 위해 Zustand의 create 함수 사용

export const useAppStore = create((set) => ({
    attackType: null, // 현재 선택된 공격 유형 상태
    logs: [], // 결제 요청 및 보안 이벤트 로그를 저장하는 배열

    // 로컬 스토리지에 access 토큰이 존재하는지로 초기 로그인 상태 결정
    isLoggedIn: !!localStorage.getItem("access"),

    // 공격 유형을 변경하는 함수
    setAttackType: (type) => set({ attackType: type }),

    // 새로운 로그를 기존 로그 배열에 추가
    addLog: (log) => 
        set((state) => 
            ({ logs: [...state.logs, log],
        })),

    // 로그인 성공 시 전역 로그인 상태를 true로 변경
    login: () => set({ isLoggedIn: true }),
    // 로그아웃 시 토큰을 제거하고 로그인 상태를 false로 변경
    logout: () => {
        localStorage.removeItem("access");
        set({ isLoggedIn: false });
    }
}));
