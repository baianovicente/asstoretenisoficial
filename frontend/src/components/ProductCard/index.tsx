'use client';

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/lib/store";
import { useWishlist } from "@/lib/wishlist";
import { formatBRL, installments } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const toggleWishlist = useWishlist((s) => s.toggle);
  const isFavorited = useWishlist((s) => s.items.includes(Number(product.id)));

  const finalPrice = product.promoPrice || product.price;
  const discount = product.promoPrice ? Math.round((1 - product.promoPrice / product.price) * 100) : 0;
  
  // Pega a imagem ou usa o placeholder
  const imageSrc = product.images && product.images.length > 0 ? product.images[0] : "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500";

  return (
    <div className="card group relative">
      <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
        {product.isNew && <span className="bg-as-green text-black text-[10px] font-bold px-2 py-0.5 rounded">NOVO</span>}
        {discount > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">-{discount}%</span>}
      </div>

      <button onClick={() => toggleWishlist(Number(product.id))} className={`absolute top-3 right-3 z-10 p-2 rounded-full transition ${isFavorited ? "bg-as-green text-black" : "bg-black/50 text-white hover:bg-as-green hover:text-black"}`}>
        <Heart size={16} fill={isFavorited ? "currentColor" : "none"} />
      </button>

      <Link href={`/produto/${product.id}`} className="block">
        <img src={imageSrc} alt={product.name} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"; }} />
      </Link>

      <div className="p-4">
        <p className="text-xs text-as-gray-light uppercase tracking-wide">{product.brand}</p>
        <Link href={`/produto/${product.id}`}>
          <h3 className="text-sm font-semibold mt-1 mb-2 hover:text-as-green transition line-clamp-1">{product.name}</h3>
        </Link>
        <div className="mb-3">
          {product.promoPrice && <p className="text-xs text-as-gray-light line-through">{formatBRL(product.price)}</p>}
          <p className="text-lg font-bold text-as-green">{formatBRL(finalPrice)}</p>
          <p className="text-[11px] text-as-gray-light">ou 12x de {installments(finalPrice)} sem juros</p>
        </div>
        <button onClick={() => addItem(product, product.sizes?.[0] || 38)} className="w-full bg-as-green hover:bg-as-green-dark text-black font-bold text-sm py-2 rounded-lg flex items-center justify-center gap-2 transition">
          <ShoppingBag size={16} /> Adicionar
        </button>
      </div>
    </div>
  );
}
