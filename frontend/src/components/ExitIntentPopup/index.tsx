'use client';

import { useEffect, useState } from 'react';
import { X, Gift } from 'lucide-react';

export default function ExitIntentPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('exit-popup-shown')) return;

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setOpen(true);
        sessionStorage.setItem('exit-popup-shown', '1');
      }
    };

    document.addEventListener('mouseleave', onMouseLeave);
    return () => document.removeEventListener('mouseleave', onMouseLeave);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-as-gray rounded-2xl p-8 max-w-md w-full relative animate-slide-up">
        <button
          onClick={() => setOpen(false)}
          aria-label="Fechar"
          className="absolute top-3 right-3 text-as-gray-light hover:text-white"
        >
          <X size={22} />
        </button>

        <div className="text-center">
          <div className="bg-as-green/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift size={32} className="text-as-green" />
          </div>
          <h2 className="text-2xl font-black mb-2">Espere! 🎁</h2>
          <p className="text-as-gray-light mb-6">
            Ganhe <strong className="text-as-green">5% OFF extra</strong> no PIX
            na sua primeira compra.
          </p>
          <div className="bg-black/40 rounded-lg p-3 mb-4">
            <p className="text-xs text-as-gray-light mb-1">Cupom exclusivo:</p>
            <p className="text-2xl font-black text-as-green tracking-wider">AS5OFF</p>
          </div>
          <button onClick={() => setOpen(false)} className="btn-primary w-full">
            Usar cupom agora
          </button>
          <button
            onClick={() => setOpen(false)}
            className="text-xs text-as-gray-light hover:text-white mt-3"
          >
            Não, obrigado
          </button>
        </div>
      </div>
    </div>
  );
}
