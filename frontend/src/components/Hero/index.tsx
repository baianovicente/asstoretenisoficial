'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const [banner, setBanner] = useState({
    title: "Os tênis mais desejados do Brasil",
    subtitle: "Autenticidade garantida, entrega expressa e 5% OFF no PIX.",
    image_url: "",
    background_image: "",
    product_image: "",
  });

  useEffect(() => {
    fetch("http://localhost:4000/api/banners")
      .then(r => r.json())
      .then(data => {
        if (data && typeof data === "object") {
          setBanner(prev => ({
            ...prev,
            ...data,
            title: data.title ? data.title : prev.title,
            subtitle: data.subtitle ? data.subtitle : prev.subtitle,
            image_url: data.image_url || data.background_image || data.product_image || "",
          }));
        }
      })
      .catch(() => {});
  }, []);

  const renderTitle = () => {
    const title = banner.title || "";
    const parts = title.split(/(desejados|desejado)/i);
    return parts.map((part, i) =>
      /desejados|desejado/i.test(part) ? (
        <span key={i} className="text-as-green">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  const activeImage = banner.image_url || banner.background_image || banner.product_image;

  return (
    <section className="relative bg-gradient-to-br from-as-black via-as-gray to-as-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
        <div className="animate-fade-in">
          <span className="inline-block bg-as-green/20 text-as-green text-xs font-bold px-3 py-1 rounded-full mb-4">
            🔥 LANÇAMENTOS 2025
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4">
            {renderTitle()}
          </h1>
          <p className="text-as-gray-light text-lg mb-8 max-w-md">
            {banner.subtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/categoria/lancamentos" className="btn-primary flex items-center gap-2">
              Comprar Agora <ArrowRight size={18} />
            </Link>
            <Link href="/categoria/promocoes" className="btn-secondary">
              Ver Promoções
            </Link>
          </div>
        </div>

        {activeImage && (
          <div className="relative animate-slide-up">
            <img
              src={activeImage}
              alt="Tênis em destaque"
              className="w-full aspect-[1.85/1] object-cover rounded-2xl shadow-[0_0_60px_rgba(0,200,83,0.4)] rotate-2 hover:rotate-0 transition-transform duration-500"
            />
          </div>
        )}
      </div>
    </section>
  );
}
