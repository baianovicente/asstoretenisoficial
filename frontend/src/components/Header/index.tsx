'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Heart, User, ShoppingBag, Menu, X, LogOut } from "lucide-react";
import { useCartCount } from "@/lib/store";
import { useCartDrawer } from "@/contexts/CartContext";
import { useWishlistCount } from "@/lib/wishlist";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { openCart } = useCartDrawer();
  const cartCount = useCartCount();
  const wishlistCount = useWishlistCount();

  useEffect(() => {
    const saved = localStorage.getItem("as_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) router.push(`/busca?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("as_user");
    setUser(null);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-as-black/95 backdrop-blur border-b border-as-gray">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="text-xl md:text-2xl font-black tracking-tight leading-none">
          <span className="text-as-green">Asstore</span>
          <span className="text-white"> Tênis Oficial</span>
          <span className="block text-[9px] tracking-[0.3em] text-as-gray-light font-medium mt-1">SNEAKERS AUTÊNTICOS</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-as-green transition">Início</Link>
          <Link href="/categoria/masculino" className="hover:text-as-green transition">Masculino</Link>
          <Link href="/categoria/feminino" className="hover:text-as-green transition">Feminino</Link>
          <Link href="/categoria/lancamentos" className="hover:text-as-green transition">Lançamentos</Link>
          <Link href="/categoria/promocoes" className="hover:text-as-green transition">Promoções</Link>
          <Link href="/sobre" className="hover:text-as-green transition">Sobre</Link>
        </nav>

        <form onSubmit={handleSearch} className="hidden md:flex items-center bg-as-gray rounded-full px-4 py-2 w-64 lg:w-72">
          <Search size={18} className="text-as-gray-light" />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar tênis..." className="bg-transparent outline-none text-sm ml-2 w-full placeholder:text-as-gray-light" />
        </form>

        <div className="flex items-center gap-4">
          {/* Conta / Sair */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm hidden md:block">Olá, {user.name?.split(" ")[0]}</span>
              <button onClick={handleLogout} aria-label="Sair" className="hover:text-red-400 transition" title="Sair">
                <LogOut size={22} />
              </button>
            </div>
          ) : (
            <Link href="/login" aria-label="Conta" className="hover:text-as-green transition"><User size={22} /></Link>
          )}

          {/* Favoritos */}
          <Link href="/favoritos" aria-label="Favoritos" className="relative hover:text-as-green transition">
            <Heart size={22} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{wishlistCount}</span>
            )}
          </Link>

          {/* Carrinho */}
          <button onClick={openCart} aria-label="Carrinho" className="relative hover:text-as-green transition">
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-as-green text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
            )}
          </button>

          {/* Menu Mobile */}
          <button className="lg:hidden" aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-as-gray bg-as-black px-4 py-4 flex flex-col gap-3 text-sm">
          <Link href="/" onClick={() => setMenuOpen(false)}>Início</Link>
          <Link href="/categoria/masculino" onClick={() => setMenuOpen(false)}>Masculino</Link>
          <Link href="/categoria/feminino" onClick={() => setMenuOpen(false)}>Feminino</Link>
          <Link href="/categoria/lancamentos" onClick={() => setMenuOpen(false)}>Lançamentos</Link>
          <Link href="/categoria/promocoes" onClick={() => setMenuOpen(false)}>Promoções</Link>
          <Link href="/sobre" onClick={() => setMenuOpen(false)}>Sobre</Link>
        </div>
      )}
    </header>
  );
}
