'use client';

import { useState, useEffect } from "react";
import { ShoppingBag, X, CheckCircle2 } from "lucide-react";

export default function RecentSalesToast() {
  const [visible, setVisible] = useState(false);
  const [currentSale, setCurrentSale] = useState<any>(null);
  const [shownOrders, setShownOrders] = useState<string[]>([]);

  useEffect(() => {
    const checkNewOrders = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/orders");
        if (!res.ok) return;
        const orders = await res.json();
        if (!orders || orders.length === 0) return;

        const newOrders = orders.filter((o: any) => !shownOrders.includes(o.id));

        if (newOrders.length > 0) {
          const order = newOrders[newOrders.length - 1];
          if (order.items && order.items.length > 0) {
            setCurrentSale({
              name: order.customer?.name || "Um cliente",
              product: order.items[0].name,
              id: order.id
            });
            setShownOrders(prev => [...prev, order.id]);
            setVisible(true);
            setTimeout(() => setVisible(false), 8000);
          }
        }
      } catch (err) {}
    };

    const interval = setInterval(checkNewOrders, 30000);
    const initialTimeout = setTimeout(checkNewOrders, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, [shownOrders]);

  if (!visible || !currentSale) return null;

  return (
    <div className="fixed bottom-6 left-6 bg-as-gray border border-as-green/30 rounded-xl p-3 shadow-2xl flex items-center gap-3 z-30 animate-slide-up">
      <div className="bg-as-green/20 p-2 rounded-lg">
        <ShoppingBag size={20} className="text-as-green" />
      </div>
      <div>
        <p className="text-sm font-bold text-white">{currentSale.name} comprou!</p>
        <p className="text-xs text-as-gray-light">{currentSale.product}</p>
        <p className="text-[10px] text-as-green font-bold flex items-center gap-1">
          <CheckCircle2 size={10} /> Compra verificada
        </p>
      </div>
      <button onClick={() => setVisible(false)} className="text-as-gray-light hover:text-white ml-2">
        <X size={16} />
      </button>
    </div>
  );
}
