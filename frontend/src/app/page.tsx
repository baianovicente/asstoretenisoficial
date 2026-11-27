'use client';

import Header from '@/components/Header';
import BenefitsBar from '@/components/BenefitsBar';
import LiveBanner from '@/components/LiveBanner';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { useProducts } from '@/lib/useProducts';

export default function Home() {
  const { products, loading } = useProducts();

  const lancamentos = products.filter((p) => p.category === 'lancamentos');
  const promocoes = products.filter((p) => p.category === 'promocoes');
  const masculino = products.filter((p) => p.category === 'masculino');
  const feminino = products.filter((p) => p.category === 'feminino');

  return (
    <>
      <LiveBanner />
      <BenefitsBar />
      <Header />
      <Hero />

      {loading ? (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-as-gray-light">
          Carregando produtos...
        </div>
      ) : (
        <>
          {lancamentos.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 py-16">
              <h2 className="text-2xl md:text-3xl font-black mb-6">
                <span className="text-as-green">Lançamentos</span> da semana
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {lancamentos.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          )}

          {promocoes.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 py-16">
              <h2 className="text-2xl md:text-3xl font-black mb-6">
                <span className="text-as-green">Promoções</span> imperdíveis
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {promocoes.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          )}

          {masculino.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 py-16">
              <h2 className="text-2xl md:text-3xl font-black mb-6">Masculino</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {masculino.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          )}

          {feminino.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 py-16">
              <h2 className="text-2xl md:text-3xl font-black mb-6">Feminino</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {feminino.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          )}
        </>
      )}

      <section className="bg-as-gray py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { title: 'Frete Expresso', desc: 'Rastreio para todo o Brasil' },
            { title: 'Troca Fácil', desc: 'Em até 7 dias após receber' },
            { title: 'Compra Segura', desc: 'Criptografia SSL' },
            { title: '12x sem juros', desc: 'Ou 5% OFF no PIX' },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="text-as-green font-bold mb-1">{item.title}</h3>
              <p className="text-sm text-as-gray-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
