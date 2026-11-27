'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloat() {
  const phone = '559285579850'; // +55 92 8557-9850
  const message = encodeURIComponent(
    'Olá! Vim pelo site Asstore Tênis Oficial e quero saber mais sobre os tênis.'
  );
  const url = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#1ebe5a] text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 group"
    >
      <MessageCircle size={28} />
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-as-black text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
        Fale conosco 💬
      </span>
    </a>
  );
}
