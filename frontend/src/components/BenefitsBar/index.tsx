'use client';

import { useEffect, useState } from 'react';
import { Truck, CreditCard, Gift, RefreshCw } from 'lucide-react';

const benefits = [
  { icon: Truck, text: 'Frete Grátis acima de R$299' },
  { icon: CreditCard, text: 'Até 12x sem juros no cartão' },
  { icon: Gift, text: '5% OFF no PIX' },
  { icon: RefreshCw, text: 'Brinde exclusivo em todo pedido' },
];

export default function BenefitsBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % benefits.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const Current = benefits[index].icon;

  return (
    <div className="bg-as-green text-black text-xs md:text-sm py-2 text-center font-semibold">
      <div className="flex items-center justify-center gap-2 transition-all duration-500">
        <Current size={16} />
        <span>{benefits[index].text}</span>
      </div>
    </div>
  );
}
