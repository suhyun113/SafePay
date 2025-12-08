import { create } from 'zustand';

export const useAppStore = create((set) => ({
    attackType: null,
    logs: [],

    setAttackType: (type) => set({ attackType: type }),
    addLog: (log) => set((state) => ({ logs: [...state.logs, log] }))
}));
