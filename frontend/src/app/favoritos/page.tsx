'use client';

import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";
import { useProducts } from "@/lib/useProducts";
import ProductCard from "@/components/ProductCard";

export default function FavoritosPage() {
  const wishlist = useWishlist((s) => s.items);
  const { products, loading } = useProducts();
  const favoritedProducts = products.filter(p => wishlist.includes(Number(p.id)));

  return (
    <main className="min-h-screen bg-as-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-1 text-sm text-as-gray-light hover:text-as-green mb-6">
          <ArrowLeft size={14} /> Voltar
        </Link>
        <h1 className="text-3xl md:text-4xl font-black mb-2">Meus <span className="text-as-green">Favoritos</span></h1>
        <p className="text-as-gray-light mb-8">{favoritedProducts.length} produto(s) salvos</p>
        {loading ? <p className="text-as-gray-light">Carregando...</p> : favoritedProducts.length === 0 ? (
          <div className="text-center py-16 bg-as-gray rounded-2xl">
            <Heart size={48} className="mx-auto mb-4 text-as-gray-light" />
            <p className="text-as-gray-light mb-4">Você ainda não favoritou nenhum produto.</p>
            <Link href="/" className="btn-primary inline-block">Explorar produtos</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favoritedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </main>
  );
}
