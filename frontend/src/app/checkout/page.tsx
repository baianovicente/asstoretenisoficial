'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Truck, CreditCard, QrCode, CheckCircle2, Copy, Loader2 } from 'lucide-react';
import { useCart, useCartTotal } from '@/lib/store';
import { formatBRL, installments } from '@/lib/format';

type Step = 'dados' | 'pagamento' | 'sucesso';

export default function CheckoutPage() {
  const items = useCart((s) => s.items);
  const total = useCartTotal();
  const clearCart = useCart((s) => s.clearCart);

  const [step, setStep] = useState<Step>('dados');
  const [payment, setPayment] = useState<'pix' | 'card' | 'boleto'>('pix');
  const [form, setForm] = useState({
    nome: '', email: '', cpf: '', telefone: '',
    cep: '', endereco: '', numero: '', bairro: '', cidade: '', estado: '',
  });
  const [frete, setFrete] = useState(0);
  const [cepCalculado, setCepCalculado] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const pixDiscount = payment === 'pix' ? total * 0.05 : 0;
  const totalFinal = total + frete - pixDiscount;

  if (items.length === 0 && step !== 'sucesso') {
    return (
      <main className="min-h-screen bg-as-black text-white flex flex-col items-center justify-center gap-4 p-8">
        <h1 className="text-2xl font-bold">Seu carrinho está vazio</h1>
        <Link href="/" className="btn-primary">Voltar para a loja</Link>
      </main>
    );
  }

  const handleCalcularFrete = () => {
    if (form.cep.replace(/\D/g, '').length === 8) {
      setFrete(total >= 299 ? 0 : 25.9);
      setCepCalculado(true);
    }
  };

  const handleFinalizar = async () => {
    setSaving(true);
    setErrorMsg('');

    const orderPayload = {
      items,
      total: Number(total.toFixed(2)),
      frete,
      paymentMethod: payment,
      customer: {
        name: form.nome,
        email: form.email,
        phone: form.telefone,
        address: `${form.endereco}, ${form.numero} - ${form.bairro}, ${form.cidade}/${form.estado}`,
      },
    };

    try {
      const ordersRes = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      if (!ordersRes.ok) throw new Error('Erro ao criar pedido');
      const orderData = await ordersRes.json();

      if (payment === 'pix') {
        const pixRes = await fetch('http://localhost:4000/api/payments/pix', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Number(totalFinal.toFixed(2)),
            email: form.email || 'cliente@email.com',
            externalReference: orderData.id,
          }),
        });

        if (!pixRes.ok) {
          const err = await pixRes.json();
          throw new Error(err.error || 'Falha ao gerar PIX');
        }

        const pix = await pixRes.json();
        setPixData(pix);
      }

      setStep('sucesso');
      setTimeout(() => clearCart(), 500);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const copyPix = () => {
    if (pixData?.qr_code) {
      navigator.clipboard.writeText(pixData.qr_code);
      alert('Código PIX copiado!');
    }
  };

  if (step === 'sucesso') {
    return (
      <main className="min-h-screen bg-as-black text-white flex items-center justify-center p-4">
        <div className="max-w-md text-center bg-as-gray rounded-2xl p-8">
          <CheckCircle2 size={64} className="text-as-green mx-auto mb-4" />
          <h1 className="text-2xl font-black mb-2">Pedido confirmado! 🎉</h1>
          {payment === 'pix' && pixData && (
            <>
              <p className="text-as-gray-light mb-4">
                {pixData.is_test ? '⚠️ MODO TESTE: ' : ''}Escaneie o QR Code abaixo ou copie o código PIX.
              </p>
              {pixData.qr_code_base64 && (
                <img src={pixData.qr_code_base64} alt="QR Code PIX" className="mx-auto rounded bg-white p-2 mb-4" />
              )}
              <div className="bg-black/40 rounded-lg p-3 mb-4 text-left">
                <p className="text-xs text-as-gray-light mb-1">Código PIX (copia e cola):</p>
                <code className="text-as-green text-xs font-mono break-all">{pixData.qr_code}</code>
              </div>
              <button onClick={copyPix} className="btn-primary w-full flex items-center justify-center gap-2">
                <Copy size={18} /> Copiar código PIX
              </button>
            </>
          )}
          {payment === 'card' && <p className="text-as-gray-light mb-4">Pagamento aprovado no cartão.</p>}
          {payment === 'boleto' && <p className="text-as-gray-light mb-4">O boleto será enviado para o e-mail.</p>}
          <Link href="/" className="btn-secondary inline-block mt-4">Voltar para a loja</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-as-black text-white pb-16">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Link href="/" className="flex items-center gap-1 text-sm text-as-gray-light hover:text-as-green mb-6">
          <ArrowLeft size={14} /> Continuar comprando
        </Link>

        <h1 className="text-3xl font-black mb-8">Finalizar <span className="text-as-green">compra</span></h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {step === 'dados' && (
              <>
                <div className="bg-as-gray rounded-2xl p-6">
                  <h2 className="font-bold mb-4 flex items-center gap-2">
                    <Truck size={18} className="text-as-green" /> Dados de entrega
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input placeholder="Nome completo" className="input" value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} />
                    <input placeholder="E-mail" className="input" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
                    <input placeholder="CPF" className="input" value={form.cpf} onChange={(e) => setForm({...form, cpf: e.target.value})} />
                    <input placeholder="Telefone" className="input" value={form.telefone} onChange={(e) => setForm({...form, telefone: e.target.value})} />
                    <input placeholder="CEP" className="input" value={form.cep} onChange={(e) => setForm({...form, cep: e.target.value})} />
                    <input placeholder="Endereço" className="input md:col-span-2" value={form.endereco} onChange={(e) => setForm({...form, endereco: e.target.value})} />
                    <input placeholder="Número" className="input" value={form.numero} onChange={(e) => setForm({...form, numero:e.target.value})} />
                    <input placeholder="Bairro" className="input" value={form.bairro} onChange={(e) => setForm({...form, bairro:e.target.value})} />
                    <input placeholder="Cidade" className="input" value={form.cidade} onChange={(e) => setForm({...form, cidade:e.target.value})} />
                    <input placeholder="Estado" className="input" value={form.estado} onChange={(e) => setForm({...form, estado:e.target.value})} />
                  </div>
                  <button onClick={handleCalcularFrete} className="btn-secondary mt-4 w-full">
                    Calcular frete
                  </button>
                  {cepCalculado && (
                    <p className="mt-2 text-sm text-as-green">
                      {frete === 0 ? '🚚 Frete Grátis!' : `Frete: ${formatBRL(frete)}`}
                    </p>
                  )}
                </div>

                <button onClick={() => setStep('pagamento')} className="btn-primary w-full">
                  Ir para pagamento
                </button>
              </>
            )}

            {step === 'pagamento' && (
              <>
                <div className="bg-as-gray rounded-2xl p-6">
                  <h2 className="font-bold mb-4">Forma de pagamento</h2>

                  <div className="space-y-3">
                    <label className={`block p-4 rounded-lg border-2 cursor-pointer transition ${payment === 'pix' ? 'border-as-green bg-as-green/10' : 'border-as-gray'}`}>
                      <input type="radio" name="pay" checked={payment === 'pix'} onChange={() => setPayment('pix')} className="hidden" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <QrCode className="text-as-green" size={22} />
                          <div>
                            <p className="font-bold">PIX</p>
                            <p className="text-xs text-as-gray-light">5% de desconto</p>
                          </div>
                        </div>
                        <span className="text-as-green font-bold">- {formatBRL(total * 0.05)}</span>
                      </div>
                    </label>

                    <label className={`block p-4 rounded-lg border-2 cursor-pointer transition ${payment === 'card' ? 'border-as-green bg-as-green/10' : 'border-as-gray'}`}>
                      <input type="radio" name="pay" checked={payment === 'card'} onChange={() => setPayment('card')} className="hidden" />
                      <div className="flex items-center gap-3">
                        <CreditCard className="text-as-green" size={22} />
                        <div>
                          <p className="font-bold">Cartão de crédito</p>
                          <p className="text-xs text-as-gray-light">Até 12x sem juros</p>
                        </div>
                      </div>
                    </label>

                    <label className={`block p-4 rounded-lg border-2 cursor-pointer transition ${payment === 'boleto' ? 'border-as-green bg-as-green/10' : 'border-as-gray'}`}>
                      <input type="radio" name="pay" checked={payment === 'boleto'} onChange={() => setPayment('boleto')} className="hidden" />
                      <div className="flex items-center gap-3">
                        <CreditCard className="text-as-green" size={22} />
                        <div>
                          <p className="font-bold">Boleto bancário</p>
                          <p className="text-xs text-as-gray-light">Vence em 3 dias úteis</p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {payment === 'pix' && (
                    <div className="mt-4 bg-black/40 rounded-lg p-4">
                      <p className="text-sm mb-3 text-center font-bold text-as-green">
                        Pague {formatBRL(totalFinal)} via PIX
                      </p>
                      <p className="text-xs text-center text-as-gray-light">
                        O QR Code será gerado após finalizar o pedido.
                      </p>
                    </div>
                  )}

                  {payment === 'card' && (
                    <div className="mt-4 space-y-2">
                      <input placeholder="Número do cartão" className="input" />
                      <input placeholder="Nome impresso" className="input" />
                      <div className="grid grid-cols-2 gap-2">
                        <input placeholder="Validade" className="input" />
                        <input placeholder="CVV" className="input" />
                      </div>
                      <p className="text-xs text-as-gray-light">Em até 12x de {installments(totalFinal)} sem juros</p>
                    </div>
                  )}

                  {errorMsg && (
                    <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
                      {errorMsg}
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep('dados')} className="btn-secondary flex-1">
                    Voltar
                  </button>
                  <button onClick={handleFinalizar} disabled={saving} className="btn-primary flex-1 disabled:opacity-50 flex items-center justify-center gap-2">
                    {saving ? <><Loader2 className="animate-spin" size={18} /> Processando...</> : 'Finalizar pedido'}
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="bg-as-gray rounded-2xl p-6 h-fit sticky top-24">
            <h2 className="font-bold mb-4">Resumo do pedido</h2>
            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex gap-2 text-sm">
                  <img src={`${item.images[0]}?w=60`} alt="" className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1">
                    <p className="line-clamp-1">{item.name}</p>
                    <p className="text-xs text-as-gray-light">Tam {item.selectedSize} x {item.quantity}</p>
                  </div>
                  <p className="text-as-green font-semibold">
                    {formatBRL((item.promoPrice || item.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-as-black/40 pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-as-gray-light">Subtotal</span>
                <span>{formatBRL(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-as-gray-light">Frete</span>
                <span>{frete === 0 ? 'Grátis' : formatBRL(frete)}</span>
              </div>
              {pixDiscount > 0 && (
                <div className="flex justify-between text-as-green">
                  <span>Desconto PIX (5%)</span>
                  <span>- {formatBRL(pixDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-as-black/40">
                <span>Total</span>
                <span className="text-as-green">{formatBRL(totalFinal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
