'use client';

import { useState, useEffect } from "react";
import { Product } from "@/types";

const API = "http://localhost:4000/api";

function formatProduct(p: any): Product {
  // Pega a imagem da PRIMEIRA variação cadastrada
  const mainImage = p.variants && p.variants.length > 0 && p.variants[0].image_url 
    ? p.variants[0].image_url 
    : "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500";

  return {
    id: String(p.id),
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: Number(p.price),
    promoPrice: p.promo_price ? Number(p.promo_price) : undefined,
    stock: p.stock,
    sizes: p.variants?.[0]?.sizes || [],
    images: [mainImage], // A imagem principal vai ser a da primeira cor
    isNew: p.is_new,
    isLastUnits: p.is_last_units,
    style: p.category,
  };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API + "/products", { cache: "no-store" });
        if (!res.ok) throw new Error("Erro");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data.map(formatProduct) : []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return { products, loading };
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(API + "/products/" + id, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return formatProduct(data);
  } catch (err) {
    return null;
  }
}
