'use client';

import { Truck, Check } from 'lucide-react';
import { formatBRL } from '@/lib/format';

const FREE_SHIPPING_THRESHOLD = 299;

export default function FreeShippingBar({ total }: { total: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const progress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);
  const isFree = remaining === 0;

  return (
    <div className="bg-black/40 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2 text-xs">
        {isFree ? (
          <>
            <Check size={14} className="text-as-green" />
            <span className="text-as-green font-bold">Você ganhou frete grátis! 🎉</span>
          </>
        ) : (
          <>
            <Truck size={14} className="text-as-green" />
            <span className="text-white">
              Faltam <strong className="text-as-green">{formatBRL(remaining)}</strong> para frete grátis
            </span>
          </>
        )}
      </div>
      <div className="h-1.5 bg-as-gray rounded-full overflow-hidden">
        <div
          className="h-full bg-as-green transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
