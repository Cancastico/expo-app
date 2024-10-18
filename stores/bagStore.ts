import { Item } from '@/types/Item';
import { create } from 'zustand';

type BagState = {
  items: Item[];
  pushItem: (item: Item) => void;
  popItem: (index?: number) => void;
  clearBag: () => void;
  updateItemQuantity: (index: number, value: number) => void;
  totalValue: number;
};

// Função auxiliar para recalcular o valor total
const calculateTotal = (items: Item[]) =>
  items.reduce((total, item) => total + item.unValue * item.quantity, 0);

const useBag = create<BagState>((set) => ({
  items: [],
  totalValue: 0,

  pushItem: (item: Item) =>
    set((state) => {
      const newItems = [...state.items, item];
      const newTotalValue = calculateTotal(newItems);
      return {
        items: newItems,
        totalValue: newTotalValue,
      };
    }),

  popItem: (index?: number) =>
    set((state) => {
      const newItems = [...state.items];

      // Remover o item da lista
      if (index !== undefined && index >= 0 && index < newItems.length) {
        newItems.splice(index, 1);
      } else {
        newItems.pop(); // Remove o último item se nenhum índice for passado
      }

      const newTotalValue = calculateTotal(newItems);
      return {
        items: newItems,
        totalValue: newTotalValue,
      };
    }),

  updateItemQuantity: (index: number, value: number) =>
    set((state) => {
      const newItems = state.items.map((item, indexList) => {
        if (indexList === index) {
          const updatedQuantity = item.quantity + value;

          // Se a quantidade for menor que 1, removemos o item
          if (updatedQuantity < 1) {
            return null;
          }

          return { ...item, quantity: updatedQuantity };
        }
        return item;
      }).filter(Boolean) as Item[]; // Remove os itens `null` gerados

      const newTotalValue = calculateTotal(newItems);
      return {
        items: newItems,
        totalValue: newTotalValue,
      };
    }),
    clearBag: () => set((state) => { return { items: [], totalValue: 0 } })
}));

export { useBag };
