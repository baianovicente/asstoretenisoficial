'use client';

import { useState, useEffect, useMemo } from "react";
import { Package, ShoppingCart, DollarSign, Plus, LogOut, Lock, X, Trash2, Settings, Upload, Tag, Users, Copy, TrendingUp, Edit, ImageIcon } from "lucide-react";
import { formatBRL } from "@/lib/format";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const API = "http://localhost:4000/api";

export default function AdminPage() {
  const [logged, setLogged] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState("dashboard");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [settings, setSettings] = useState({ mpAccessToken: "", pixKey: "" });
  const [banner, setBanner] = useState({ title: "", subtitle: "", image_url: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Modais
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  
  // Produto state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", promoPrice: "", category: "lancamentos", brand: "Asstore", description: "" });
  const [variants, setVariants] = useState([{ color_name: "Preto", image_url: "", sizes: [38, 39, 40, 41, 42], stock: 10 }]);
  
  // Cupom state
  const [newCoupon, setNewCoupon] = useState({ code: "", type: "percent", value: "" });
  const [couponMsg, setCouponMsg] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("as_admin_token");
    if (savedToken) {
      setLogged(true);
      fetchData();
      fetchSettings();
      fetchBanner();
    }
  }, []);

  const fetchData = async () => {
    try {
      const [pRes, oRes, cRes] = await Promise.all([fetch(API + "/products"), fetch(API + "/orders"), fetch(API + "/coupons")]);
      setProducts(await pRes.json() || []);
      setOrders(await oRes.json() || []);
      setCoupons(await cRes.json() || []);
    } catch (err) { console.error(err); }
  };

  const fetchSettings = async () => {
    try { const r = await fetch(API + "/settings"); setSettings(await r.json()); } catch (err) {}
  };
  const fetchBanner = async () => {
    try { const r = await fetch(API + "/banners"); setBanner(await r.json()); } catch (err) {}
  };

  const login = async () => {
    setErrorMsg(""); setLoading(true);
    try {
      const res = await fetch(API + "/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Credenciais inválidas");
      localStorage.setItem("as_admin_token", data.token);
      setLogged(true);
      fetchData(); fetchSettings(); fetchBanner();
    } catch (err: any) { setErrorMsg(err.message); }
    finally { setLoading(false); }
  };

  const logout = () => { localStorage.removeItem("as_admin_token"); setLogged(false); };

  // --- PRODUTOS ---
  const openNewProduct = () => {
    setEditingId(null);
    setNewProduct({ name: "", price: "", promoPrice: "", category: "lancamentos", brand: "Asstore", description: "" });
    setVariants([{ color_name: "Preto", image_url: "", sizes: [38, 39, 40, 41, 42], stock: 10 }]);
    setIsProductModalOpen(true);
  };

  const openEditProduct = (p: any) => {
    setEditingId(p.id);
    setNewProduct({ name: p.name, price: String(p.price), promoPrice: p.promo_price ? String(p.promo_price) : "", category: p.category, brand: p.brand, description: p.description || "" });
    setVariants(p.variants.map((v: any) => ({
      color_name: v.color_name, image_url: v.image_url, sizes: v.sizes || [], stock: v.stock || 0
    })));
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (variants.some(v => !v.image_url)) return alert("Envie foto para todas as cores.");
    setLoading(true);
    const body = {
      name: newProduct.name, brand: newProduct.brand, category: newProduct.category,
      price: Number(newProduct.price), promoPrice: newProduct.promoPrice ? Number(newProduct.promoPrice) : null,
      description: newProduct.description, isNew: true,
      variants: variants.map(v => ({ ...v, stock: Number(v.stock) }))
    };
    try {
      const url = editingId ? API + "/products/" + editingId : API + "/products";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error("Erro ao salvar");
      fetchData(); setIsProductModalOpen(false);
    } catch (err) { alert("Erro ao salvar produto."); } finally { setLoading(false); }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Apagar este produto?")) return;
    await fetch(API + "/products/" + id, { method: "DELETE" });
    fetchData();
  };

  // --- CUPONS ---
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault(); setCouponMsg("");
    try {
      const res = await fetch(API + "/coupons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newCoupon) });
      if (!res.ok) throw new Error("Erro");
      fetchData(); setIsCouponModalOpen(false); setNewCoupon({ code: "", type: "percent", value: "" });
    } catch (err) { setCouponMsg("❌ Erro ao criar cupom."); }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Apagar este cupom?")) return;
    await fetch(API + "/coupons/" + id, { method: "DELETE" });
    fetchData();
  };

  // --- UPLOAD DE FOTO (Base64) ---
  const handleUpload = (file: File, index: number) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const newV = [...variants];
      newV[index].image_url = reader.result as string;
      setVariants(newV);
    };
    reader.readAsDataURL(file);
  };

  if (!logged) {
    return (
      <main className="min-h-screen bg-as-black flex items-center justify-center p-4">
        <div className="bg-as-gray p-8 rounded-2xl w-full max-w-md">
          <div className="text-center mb-6"><Lock className="mx-auto text-as-green mb-2" size={40} /><h1 className="text-2xl font-black text-white">Admin Asstore</h1></div>
          {errorMsg && <div className="bg-red-500/10 text-red-400 p-2 rounded mb-4 text-sm text-center">{errorMsg}</div>}
          <input type="email" placeholder="E-mail" className="input mb-3" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Senha" className="input mb-4" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={login} disabled={loading} className="btn-primary w-full">{loading ? "Entrando..." : "Entrar"}</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-as-black text-white flex">
      <aside className="w-64 bg-as-gray p-4 flex flex-col hidden md:flex">
        <h1 className="text-xl font-black text-as-green mb-8">Asstore Admin</h1>
        <nav className="flex-1 space-y-2">
          <button onClick={() => setTab("dashboard")} className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${tab === "dashboard" ? "bg-as-green text-black font-bold" : "hover:bg-black/20"}`}><DollarSign size={20} /> Dashboard</button>
          <button onClick={() => setTab("produtos")} className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${tab === "produtos" ? "bg-as-green text-black font-bold" : "hover:bg-black/20"}`}><Package size={20} /> Produtos</button>
          <button onClick={() => setTab("cupons")} className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${tab === "cupons" ? "bg-as-green text-black font-bold" : "hover:bg-black/20"}`}><Tag size={20} /> Cupons</button>
          <button onClick={() => setTab("pedidos")} className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${tab === "pedidos" ? "bg-as-green text-black font-bold" : "hover:bg-black/20"}`}><ShoppingCart size={20} /> Pedidos</button>
        </nav>
        <button onClick={logout} className="mt-auto flex items-center gap-2 text-red-400 p-3"><LogOut size={20} /> Sair</button>
      </aside>

      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold capitalize">{tab}</h2>
          {tab === "produtos" && <button onClick={openNewProduct} className="btn-primary flex items-center gap-2 text-sm py-2"><Plus size={16} /> Novo Produto</button>}
          {tab === "cupons" && <button onClick={() => setIsCouponModalOpen(true)} className="btn-primary flex items-center gap-2 text-sm py-2"><Plus size={16} /> Novo Cupom</button>}
        </div>

        {tab === "dashboard" && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-as-gray p-6 rounded-xl"><p className="text-as-gray-light text-sm mb-2">Faturamento</p><p className="text-2xl font-black">{formatBRL(orders.reduce((s, o) => s + (Number(o.total)||0), 0))}</p></div>
            <div className="bg-as-gray p-6 rounded-xl"><p className="text-as-gray-light text-sm mb-2">Pedidos</p><p className="text-2xl font-black text-as-green">{orders.length}</p></div>
            <div className="bg-as-gray p-6 rounded-xl"><p className="text-as-gray-light text-sm mb-2">Produtos</p><p className="text-2xl font-black">{products.length}</p></div>
          </div>
        )}

        {tab === "produtos" && (
          <div className="bg-as-gray rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-black/30 text-as-gray-light text-sm">
                <tr><th className="p-4">Produto</th><th className="p-4">Preço</th><th className="p-4">Cores</th><th className="p-4 text-right">Ações</th></tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-t border-white/5">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-black/50 flex items-center justify-center overflow-hidden">
                        {p.variants?.[0]?.image_url ? (
                          <img 
                            src={
                              p.variants[0].image_url.startsWith("data:image") 
                                ? p.variants[0].image_url 
                                : (p.variants[0].image_url.startsWith("http") ? p.variants[0].image_url : `${p.variants[0].image_url}?w=100`)
                            } 
                            className="w-full h-full object-cover" 
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100"; }}
                          />
                        ) : (
                          <ImageIcon size={20} className="text-gray-500" />
                        )}
                      </div>
                      <span className="font-bold">{p.name}</span>
                    </td>
                    <td className="p-4 text-as-green font-bold">{formatBRL(p.promo_price || p.price)}</td>
                    <td className="p-4">{p.variants?.length || 0} cor(es)</td>
                    <td className="p-4 text-right">
                      <button onClick={() => openEditProduct(p)} className="text-blue-400 p-2 hover:bg-blue-400/10 rounded mr-2"><Edit size={18} /></button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="text-red-400 p-2 hover:bg-red-400/10 rounded"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "cupons" && (
          <div className="bg-as-gray rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-black/30 text-as-gray-light text-sm"><tr><th className="p-4">Código</th><th className="p-4">Desconto</th><th className="p-4 text-right">Ações</th></tr></thead>
              <tbody>
                {coupons.map(c => (
                  <tr key={c.id} className="border-t border-white/5">
                    <td className="p-4 font-bold text-as-green">{c.code}</td>
                    <td className="p-4">{c.type === "percent" ? c.value + "%" : formatBRL(c.value)}</td>
                    <td className="p-4 text-right"><button onClick={() => handleDeleteCoupon(c.id)} className="text-red-400 p-2"><Trash2 size={18} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "pedidos" && (
          <div className="space-y-4">
            {orders.map(o => (
              <div key={o.id} className="bg-as-gray p-4 rounded-xl flex justify-between items-center">
                <div><p className="font-bold">#{o.id}</p><p className="text-sm text-as-gray-light">{new Date(o.created_at).toLocaleString("pt-BR")}</p></div>
                <p className="font-black text-as-green">{formatBRL(o.total)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE PRODUTO (Criar / Editar) */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-as-gray w-full max-w-2xl rounded-2xl p-6 my-8 relative">
            <button onClick={() => setIsProductModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>
            <h2 className="text-2xl font-bold mb-6">{editingId ? "Editar Produto" : "Novo Produto"}</h2>
            
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Nome" required className="input" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                <input placeholder="Marca" required className="input" value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Preço R$" type="number" step="0.01" required className="input" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                <input placeholder="Preço Promo R$" type="number" step="0.01" className="input" value={newProduct.promoPrice} onChange={e => setNewProduct({...newProduct, promoPrice: e.target.value})} />
              </div>
              <textarea placeholder="Descrição detalhada" className="input h-20 resize-none" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />

              <div className="border-t border-white/10 pt-4 mt-4">
                <button type="button" onClick={() => setVariants([...variants, { color_name: "", image_url: "", sizes: [], stock: 10 }])} className="bg-white/10 px-3 py-1 rounded text-sm hover:bg-white/20 mb-4">+ Adicionar Cor</button>
                {variants.map((v, i) => (
                  <div key={i} className="bg-black/20 p-4 rounded-xl mb-4 relative">
                    {variants.length > 1 && <button type="button" onClick={() => setVariants(variants.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-400"><X size={16}/></button>}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input placeholder="Nome da Cor" required className="input" value={v.color_name} onChange={e => { const n = [...variants]; n[i].color_name = e.target.value; setVariants(n); }} />
                      <input placeholder="Estoque" type="number" required className="input" value={v.stock} onChange={e => { const n = [...variants]; n[i].stock = Number(e.target.value); setVariants(n); }} />
                    </div>
                    <div className="flex gap-4">
                      <div onClick={() => document.getElementById("file_"+i)?.click()} className="w-24 h-24 bg-black/50 border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center cursor-pointer hover:border-as-green relative overflow-hidden">
                        <input type="file" id={"file_"+i} className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], i)} />
                        {v.image_url ? (
                          <img 
                            src={
                              v.image_url.startsWith("data:image") 
                                ? v.image_url 
                                : (v.image_url.startsWith("http") ? v.image_url : `${v.image_url}?w=100`)
                            } 
                            className="w-full h-full object-cover" 
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100"; }}
                          />
                        ) : (
                          <Upload size={20} className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 mb-2">Tamanhos:</p>
                        <div className="flex flex-wrap gap-1">
                          {[34,35,36,37,38,39,40,41,42,43,44,45].map(s => (
                            <button type="button" key={s} onClick={() => {
                              const n = [...variants]; const sz = n[i].sizes;
                              n[i].sizes = sz.includes(s) ? sz.filter(x => x !== s) : [...sz, s].sort((a,b)=>a-b);
                              setVariants(n);
                            }} className={`w-8 h-8 text-xs font-bold rounded ${v.sizes.includes(s) ? "bg-as-green text-black" : "bg-white/10 text-white"}`}>{s}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3">{loading ? "Salvando..." : "Salvar Produto"}</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CUPOM */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-as-gray w-full max-w-md rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Novo Cupom</h2>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <input placeholder="Código (Ex: BEMVINDO10)" className="input uppercase" value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} />
              <div className="grid grid-cols-2 gap-4">
                <select className="input" value={newCoupon.type} onChange={e => setNewCoupon({...newCoupon, type: e.target.value})}><option value="percent">%</option><option value="fixed">R$</option></select>
                <input type="number" placeholder="Valor" className="input" value={newCoupon.value} onChange={e => setNewCoupon({...newCoupon, value: e.target.value})} />
              </div>
              <button type="submit" className="btn-primary w-full">Criar</button>
              <button type="button" onClick={() => setIsCouponModalOpen(false)} className="w-full text-sm text-gray-400 hover:text-white">Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
