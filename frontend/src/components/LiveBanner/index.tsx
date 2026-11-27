'use client';

import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';

export default function LiveBanner() {
  const [count, setCount] = useState(7);

  useEffect(() => {
    setCount(Math.floor(Math.random() * 12) + 3);
    const t = setInterval(() => {
      setCount(Math.floor(Math.random() * 12) + 3);
    }, 15000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-black text-white text-xs md:text-sm py-2 px-4 text-center border-b border-as-gray">
      <span className="inline-flex items-center gap-2">
        <Flame size={14} className="text-as-green animate-pulse" />
        <strong className="text-as-green">{count} pessoas</strong>
        <span className="text-as-gray-light">estão comprando agora</span>
      </span>
    </div>
  );
}
