'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Star } from "lucide-react";
import { useCart } from "@/lib/store";
import { useCartDrawer } from "@/contexts/CartContext";
import { formatBRL, installments } from "@/lib/format";
import { useWishlist } from "@/lib/wishlist";
import { useProducts } from "@/lib/useProducts";
import ProductCard from "@/components/ProductCard";

export default function ProdutoPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  const addItem = useCart((s) => s.addItem);
  const { openCart } = useCartDrawer();
  const toggleWishlist = useWishlist((s) => s.toggle);
  const wishlistItems = useWishlist((s) => s.items);

  // Puxa a lista de produtos para a seção "Você também pode gostar"
  const { products } = useProducts();

  useEffect(() => {
    fetch("http://localhost:4000/api/products/" + params.id)
      .then(r => r.json())
      .then((p) => {
        setProduct(p);
        if (p && p.variants && p.variants.length > 0) {
          setSelectedSize(p.variants[0].sizes?.[0] || null);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  const isFavorited = product ? wishlistItems.includes(Number(product.id)) : false;

  if (loading) return <div className="min-h-screen bg-as-black flex items-center justify-center text-white">Carregando...</div>;
  if (!product) return <div className="min-h-screen bg-as-black flex items-center justify-center text-white">Produto não encontrado.</div>;

  if (!product.variants || product.variants.length === 0) {
    product.variants = [{ id: "0", color_name: "Padrão", image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800", sizes: [38, 39, 40, 41, 42], stock: 10 }];
  }

  const activeVariant = product.variants[activeVariantIndex];
  const finalPrice = product.promo_price ? Number(product.promo_price) : Number(product.price);
  const pixPrice = finalPrice * 0.95;
  const discount = product.promo_price ? Math.round((1 - product.promo_price / product.price) * 100) : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("⚠️ Por favor, selecione um tamanho antes de adicionar.");
      return;
    }
    const cartProduct = {
      id: String(product.id),
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: Number(product.price),
      promoPrice: product.promo_price ? Number(product.promo_price) : null,
      images: [activeVariant.image_url],
      sizes: activeVariant.sizes
    };
    addItem(cartProduct, selectedSize);
    openCart();
  };

  // Filtra produtos para recomendar (excluindo o atual)
  const relatedProducts = products.filter(p => p.id !== String(product.id)).slice(0, 4);

  return (
    <main className="min-h-screen bg-as-black text-white pb-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-as-gray-light mb-6">
          <button onClick={() => router.back()} className="flex items-center gap-1 hover:text-as-green transition">
            <ArrowLeft size={14} /> Voltar
          </button>
          <span>|</span>
          <Link href={`/categoria/${product.category}`} className="capitalize hover:text-as-green transition">{product.category}</Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          
          {/* Lado Esquerdo: Fotos */}
          <div>
            {/* Foto Grande */}
            <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden mb-4 h-[500px] flex items-center justify-center">
              <img 
                src={activeVariant.image_url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"} 
                alt={product.name} 
                className="w-full h-full object-cover" 
                onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"; }}
              />
            </div>
            
            {/* Miniaturas (Fotos/Cores) */}
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {product.variants.map((v: any, i: number) => (
                <button 
                  key={v.id} 
                  onClick={() => { setActiveVariantIndex(i); setSelectedSize(v.sizes?.[0] || null); }}
                  className={`w-20 h-20 rounded-lg bg-[#1A1A1A] p-1 border-2 transition flex-shrink-0 overflow-hidden ${activeVariantIndex === i ? "border-as-green" : "border-transparent hover:border-gray-500"}`}
                >
                  <img 
                    src={v.image_url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200"} 
                    alt={v.color_name} 
                    className="w-full h-full object-cover rounded" 
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200"; }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Lado Direito: Info */}
          <div>
            <p className="text-sm text-as-gray-light uppercase tracking-wider mb-1">{product.brand}</p>
            <h1 className="text-3xl md:text-4xl font-black mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-as-green">
                <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
              </div>
              <span className="text-sm text-as-gray-light">(48 avaliações)</span>
            </div>

            <div className="mb-6">
              {product.promo_price && <p className="text-sm text-as-gray-light line-through">{formatBRL(product.price)}</p>}
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black text-as-green">{formatBRL(finalPrice)}</p>
                {discount > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">{discount}% OFF</span>}
              </div>
              <p className="text-as-gray-light mt-1">ou 12x de {installments(finalPrice)} sem juros</p>
              <p className="text-sm text-orange-400 font-bold mt-1">💰 {formatBRL(pixPrice)} no PIX (5% OFF)</p>
            </div>

            <div className="mb-6">
              <p className="font-bold mb-2">Cor: <span className="text-as-gray-light font-normal">{activeVariant.color_name}</span></p>
            </div>

            {/* Tamanhos */}
            <div className="mb-6">
              <p className="font-bold mb-2">Escolha o tamanho:</p>
              <div className="flex flex-wrap gap-2">
                {activeVariant.sizes && activeVariant.sizes.length > 0 ? (
                  activeVariant.sizes.map((size: number) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-lg font-bold border-2 transition ${selectedSize === size ? "bg-as-green text-black border-as-green" : "bg-transparent text-white border-as-gray hover:border-as-green"}`}
                    >
                      {size}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-red-400">Nenhum tamanho cadastrado para esta cor.</p>
                )}
              </div>
            </div>

            {/* Botão Adicionar */}
            <div className="flex gap-3 mb-8">
              <button onClick={handleAddToCart} className="flex-1 btn-primary flex items-center justify-center gap-2 py-4 text-lg font-bold">
                <ShoppingBag size={20} /> Adicionar ao carrinho
              </button>
              <button onClick={() => toggleWishlist(Number(product.id))} className={`w-14 rounded-lg flex items-center justify-center border-2 transition ${isFavorited ? "border-as-green text-as-green bg-as-green/10" : "border-as-gray hover:border-as-green text-white"}`}>
                <Heart size={24} fill={isFavorited ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="space-y-3 text-sm text-as-gray-light border-t border-white/10 pt-6">
              <div className="flex items-center gap-3"><Truck size={18} className="text-as-green" /> Frete expresso com rastreio</div>
              <div className="flex items-center gap-3"><ShieldCheck size={18} className="text-as-green" /> Compra 100% segura (SSL)</div>
              <div className="flex items-center gap-3"><RefreshCw size={18} className="text-as-green" /> Troca em até 7 dias</div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <h3 className="text-lg font-bold mb-2">Descrição</h3>
              <p className="text-as-gray-light text-sm leading-relaxed">{product.description || "Sem descrição disponível."}</p>
            </div>
          </div>
        </div>

        {/* VOCÊ TAMBÉM PODE GOSTAR */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-white/10 pt-10">
            <h2 className="text-2xl font-black mb-6">Você também pode <span className="text-as-green">gostar</span></h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
