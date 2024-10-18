import { create } from "zustand";

type OrderStore = {
  mesa: number | null;
  comanda: number | null;
  setData: (comanda?: number, mesa?: number) => void;
  clearOrder: () => void;
}

const useOrder = create<OrderStore>((set) => ({
  mesa: null,
  comanda: null,
  setData: (comanda, mesa) => set({ mesa: mesa ?? null, comanda: comanda ?? null }),
  clearOrder: () => set({ mesa: null, comanda: null })
}));

export { useOrder };
