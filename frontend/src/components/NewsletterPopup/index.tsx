'use client';

import { API_URL } from "../../lib/api";
import { useState, useEffect } from 'react';
import { Gift, X } from 'lucide-react';

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já fechou ou cadastrou recentemente
    const lastDismissed = localStorage.getItem('as_newsletter_dismissed');
    const subscribed = localStorage.getItem('as_newsletter_subscribed');
    
    if (lastDismissed || subscribed) {
      const now = Date.now();
      const dismissTime = lastDismissed ? Number(lastDismissed) : 0;
      const subTime = subscribed ? Number(subscribed) : 0;
      const lastAction = Math.max(dismissTime, subTime);
      
      // Se a última ação foi há menos de 7 dias (fechou) ou 30 dias (cadastrou), não mostra
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (now - lastAction < sevenDays) return;
    }

    // Aparece após 15 segundos de navegação
    const timer = setTimeout(() => setIsOpen(true), 15000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('as_newsletter_dismissed', String(Date.now()));
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Erro ao cadastrar');
      
      localStorage.setItem('as_newsletter_subscribed', String(Date.now()));
      setSuccess(true);
    } catch (err) {
      alert('Erro ao cadastrar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-as-gray rounded-2xl p-8 w-full max-w-md relative">
        <button onClick={handleDismiss} className="absolute top-4 right-4 text-as-gray-light hover:text-white">
          <X size={24} />
        </button>

        {success ? (
          <div className="text-center">
            <Gift size={48} className="text-as-green mx-auto mb-4" />
            <h2 className="text-2xl font-black mb-2 text-white">Cupom liberado! 🎉</h2>
            <p className="text-as-gray-light mb-4">Use o cupom abaixo no checkout e ganhe 10% OFF:</p>
            <div className="bg-as-black text-as-green font-mono text-2xl font-bold p-4 rounded-lg mb-4">
              BEMVINDO10
            </div>
            <button onClick={handleDismiss} className="btn-primary w-full">Continuar comprando</button>
          </div>
        ) : (
          <div className="text-center">
            <Gift size={48} className="text-as-green mx-auto mb-4" />
            <h2 className="text-2xl font-black mb-2 text-white">Ganhe 10% OFF 🎁</h2>
            <p className="text-as-gray-light mb-6">Cadastre seu e-mail e receba um cupom de 10% OFF na primeira compra.</p>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="input mb-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={saving} className="btn-primary w-full mb-2">
                {saving ? 'Cadastrando...' : 'Quero meu cupom'}
              </button>
              <button type="button" onClick={handleDismiss} className="text-as-gray-light text-sm hover:text-white">
                Agora não
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
