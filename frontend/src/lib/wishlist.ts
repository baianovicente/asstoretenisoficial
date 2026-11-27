import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistStore {
  items: number[];
  toggle: (id: number) => void;
  has: (id: number) => boolean;
  clear: () => void;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (id) =>
        set({
          items: get().items.includes(id)
            ? get().items.filter((x) => x !== id)
            : [...get().items, id],
        }),
      has: (id) => get().items.includes(id),
      clear: () => set({ items: [] }),
    }),
    { name: "as_wishlist" }
  )
);

export const useWishlistCount = () => useWishlist((s) => s.items.length);
