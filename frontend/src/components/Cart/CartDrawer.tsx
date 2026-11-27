'use client';

import Link from 'next/link';
import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCart, useCartTotal } from '@/lib/store';
import { useCartDrawer } from '@/contexts/CartContext';
import { formatBRL } from '@/lib/format';
import FreeShippingBar from './FreeShippingBar';

export default function CartDrawer() {
  const { isOpen, closeCart } = useCartDrawer();
  const items = useCart((s) => s.items);
  const removeItem = useCart((s) => s.removeItem);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const total = useCartTotal();

  const pixDiscount = total * 0.05;
  const totalPix = total - pixDiscount;

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 z-50 animate-fade-in"
        onClick={closeCart}
      />

      <aside className="fixed top-0 right-0 h-full w-full max-w-md bg-as-black z-50 flex flex-col animate-slide-up shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-as-gray">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag size={20} className="text-as-green" />
            Carrinho ({items.length})
          </h2>
          <button onClick={closeCart} aria-label="Fechar" className="hover:text-as-green">
            <X size={22} />
          </button>
        </div>

        {items.length > 0 && (
          <div className="p-4 border-b border-as-gray">
            <FreeShippingBar total={total} />
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag size={48} className="mx-auto text-as-gray mb-4" />
              <p className="text-as-gray-light">Seu carrinho está vazio</p>
              <button onClick={closeCart} className="btn-primary mt-6 inline-block">
                Continuar comprando
              </button>
              <a
                href="https://wa.me/559285579850?text=Ol%C3%A1!%20Preciso%20de%20ajuda%20para%20escolher%20um%20t%C3%AAnis"
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-3 text-sm text-as-green hover:underline"
              >
                💬 Precisa de ajuda? Fale no WhatsApp
              </a>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize}`}
                className="flex gap-3 bg-as-gray rounded-lg p-2"
              >
                <img 
                    src={
                      item.images?.[0]?.startsWith("data:image") 
                        ? item.images[0] 
                        : (item.images?.[0]?.startsWith("http") ? `${item.images[0]}?w=100` : "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100")
                    } 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded" 
                  />
                <div className="flex-1">
                  <p className="text-sm font-semibold line-clamp-1">{item.name}</p>
                  <p className="text-xs text-as-gray-light">Tamanho: {item.selectedSize}</p>
                  <p className="text-as-green font-bold text-sm">
                    {formatBRL(item.promoPrice || item.price)}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedSize, Math.max(1, item.quantity - 1))}
                        className="bg-black/40 hover:bg-as-green hover:text-black p-1 rounded"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                        className="bg-black/40 hover:bg-as-green hover:text-black p-1 rounded"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id, item.selectedSize)}
                      aria-label="Remover"
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-as-gray p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-as-gray-light">Subtotal</span>
              <span>{formatBRL(total)}</span>
            </div>
            <div className="flex justify-between text-sm text-as-green font-semibold">
              <span>5% OFF no PIX</span>
              <span>- {formatBRL(pixDiscount)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total no PIX</span>
              <span className="text-as-green">{formatBRL(totalPix)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full text-center block"
            >
              Finalizar compra
            </Link>
            <button onClick={closeCart} className="w-full text-sm text-as-gray-light hover:text-as-green">
              Continuar comprando
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
