import { create } from 'zustand';
import { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, size: number) => void;
  removeItem: (id: string, size: number) => void;
  updateQuantity: (id: string, size: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  addItem: (product, size) => {
    const existing = get().items.find(
      (item) => item.id === product.id && item.selectedSize === size
    );
    if (existing) {
      set({
        items: get().items.map((item) =>
          item.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({
        items: [...get().items, { ...product, quantity: 1, selectedSize: size }],
      });
    }
  },
  removeItem: (id, size) =>
    set({
      items: get().items.filter(
        (item) => !(item.id === id && item.selectedSize === size)
      ),
    }),
  updateQuantity: (id, size, quantity) =>
    set({
      items: get().items.map((item) =>
        item.id === id && item.selectedSize === size
          ? { ...item, quantity }
          : item
      ),
    }),
  clearCart: () => set({ items: [] }),
}));

// Helpers fora do store (evita loops de re-render)
export const useCartTotal = () =>
  useCart((s) =>
    s.items.reduce(
      (sum, item) => sum + (item.promoPrice || item.price) * item.quantity,
      0
    )
  );

export const useCartCount = () =>
  useCart((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));
