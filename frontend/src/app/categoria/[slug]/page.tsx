"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Filter, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { formatBRL } from "@/lib/format";
import { useProducts } from "@/lib/useProducts";

const TITLES: Record<string, string> = {
  masculino: "Masculino", feminino: "Feminino", lancamentos: "Lançamentos",
  promocoes: "Promoções", corrida: "Corrida", casual: "Casual", skate: "Skate", basquete: "Basquete"
};

export default function CategoryPage() {
  const params = useParams();
  const slug = String(params.slug);
  const { products, loading } = useProducts();
  const [brands, setBrands] = useState<string[]>([]);
  const [sizes, setSizes] = useState<number[]>([]);
  const [sort, setSort] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchesCategory = p.category === slug || p.style === slug;
      if (!matchesCategory) return false;
      if (brands.length > 0 && !brands.includes(p.brand)) return false;
      if (sizes.length > 0 && !p.sizes.some((s) => sizes.includes(s))) return false;
      return true;
    });
    switch (sort) {
      case "price-asc": result.sort((a, b) => (a.promoPrice || a.price) - (b.promoPrice || b.price)); break;
      case "price-desc": result.sort((a, b) => (b.promoPrice || b.price) - (a.promoPrice || a.price)); break;
      case "newest": result.sort((a, b) => Number(b.isNew) - Number(a.isNew)); break;
    }
    return result;
  }, [products, slug, brands, sizes, sort]);

  const allBrands = Array.from(new Set(products.map((p) => p.brand)));
  const allSizes = Array.from(new Set(products.flatMap((p) => p.sizes))).sort((a, b) => a - b);

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#0D0D0D", color: "white", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", color: "#B0B0B0", textDecoration: "none", marginBottom: "24px" }}>
          <ArrowLeft size={16} /> Voltar para a loja
        </Link>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "8px" }}>{TITLES[slug] || slug}</h1>
        <p style={{ color: "#B0B0B0", marginBottom: "32px" }}>{loading ? "Carregando..." : filtered.length + " produto(s) encontrado(s)"}</p>

        <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
          <button onClick={() => setShowFilters(!showFilters)} style={{ backgroundColor: "#2A2A2A", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
            <Filter size={16} /> Filtros
          </button>
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ backgroundColor: "#2A2A2A", color: "white", border: "none", padding: "10px", borderRadius: "8px" }}>
            <option value="relevance">Relevância</option>
            <option value="newest">Novidades</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "32px" }}>
          {showFilters && (
            <aside style={{ width: "250px", backgroundColor: "#2A2A2A", padding: "20px", borderRadius: "12px", height: "fit-content" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "12px" }}>Marca</h3>
              {allBrands.map((b) => (
                <label key={b} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", cursor: "pointer" }}>
                  <input type="checkbox" checked={brands.includes(b)} onChange={() => setBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b])} style={{ accentColor: "#00C853" }} />
                  {b}
                </label>
              ))}
              <h3 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "12px", marginTop: "24px" }}>Tamanho</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {allSizes.map((s) => (
                  <button key={s} onClick={() => setSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])} style={{ width: "36px", height: "36px", borderRadius: "6px", border: sizes.includes(s) ? "2px solid #00C853" : "1px solid #B0B0B0", backgroundColor: sizes.includes(s) ? "#00C853" : "transparent", color: sizes.includes(s) ? "#0D0D0D" : "white", cursor: "pointer", fontWeight: "bold" }}>
                    {s}
                  </button>
                ))}
              </div>
            </aside>
          )}

          <div style={{ flex: 1 }}>
            {loading ? (
              <p style={{ color: "#B0B0B0" }}>Carregando produtos...</p>
            ) : filtered.length === 0 ? (
              <p style={{ color: "#B0B0B0" }}>Nenhum produto encontrado.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px" }}>
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
