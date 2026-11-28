'use client';

import { API_URL } from "../../lib/api";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const DEFAULT_TITLE = "Os tênis mais desejados do Brasil";
const DEFAULT_SUBTITLE = "Autenticidade garantida, entrega expressa e 5% OFF no PIX.";
const DEFAULT_OPACITY = 100;

function normalizeOpacity(value: unknown): number {
const num = Number(value);
if (!Number.isFinite(num)) return DEFAULT_OPACITY;
return Math.max(0, Math.min(100, Math.round(num)));
}

export default function Hero() {
const [banner, setBanner] = useState({
title: DEFAULT_TITLE,
subtitle: DEFAULT_SUBTITLE,
image_url: "",
background_image: "",
product_image: "",
opacity: DEFAULT_OPACITY,
});

useEffect(() => {
fetch(`${API_URL}/api/banners`)
  .then((r) => r.json())
  .then((data) => {
    if (data && typeof data === "object") {
      setBanner((prev) => ({
        ...prev,
        ...data,
        title:
          typeof data.title === "string" && data.title.trim() !== ""
            ? data.title
            : DEFAULT_TITLE,
        subtitle:
          typeof data.subtitle === "string" && data.subtitle.trim() !== ""
            ? data.subtitle
            : DEFAULT_SUBTITLE,
        image_url: data.image_url || data.background_image || "",
        background_image: data.background_image || data.image_url || "",
        product_image: data.product_image || "",
        opacity: normalizeOpacity(data.opacity),
      }));
    }
  })
  .catch(() => {});
}, []);

const renderTitle = () => {
const title = banner.title || DEFAULT_TITLE;
const parts = title.split(/(desejados|desejado)/i);
return parts.map((part, i) =>
  /desejados|desejado/i.test(part) ? (
    <span key={i} className="text-as-green">
      {part}
    </span>
  ) : (
    <span key={i}>{part}</span>
  )
);
};

const bgImage = banner.background_image || banner.image_url;
const opacityDecimal = normalizeOpacity(banner.opacity) / 100;

return (
<section className="relative bg-as-black overflow-hidden min-h-[366px] flex items-center">
  {bgImage && (
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-cover bg-center scale-100 transition-opacity duration-150"
      style={{
        backgroundImage: `url("${bgImage}")`,
        opacity: opacityDecimal,
      }}
    />
  )}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-gradient-to-r from-as-black/65 via-as-black/30 to-transparent pointer-events-none"
  />

  <div className="relative z-10 max-w-7xl w-full mx-auto px-4 py-16 md:py-24">
    <div className="max-w-2xl animate-fade-in">
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
  </div>
</section>
);
}
