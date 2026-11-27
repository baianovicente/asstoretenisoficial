import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-as-black text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-1 text-sm text-as-gray-light hover:text-as-green mb-8">
          <ArrowLeft size={14} /> Voltar para a loja
        </Link>
        <h1 className="text-4xl font-black mb-6">Sobre a <span className="text-as-green">Asstore</span></h1>
        <div className="space-y-6 text-as-gray-light leading-relaxed">
          <p>A <strong>Asstore Tênis Oficial</strong> nasceu com uma missão clara: trazer os sneakers mais desejados do Brasil para o seu armário, com autenticidade garantida, preço justo e entrega rápida.</p>
          <p>Somos especialistas em tênis premium, streetwear e cultura sneaker. Cada par que passa pela nossa curadoria é verificado rigorosamente, para que você tenha a certeza de que está comprando um produto 100% original.</p>
          <p>Atendemos todo o Brasil com frete expresso e rastreio completo. Oferecemos ainda 5% de desconto no PIX e parcelamento em até 12x sem juros no cartão.</p>
        </div>
      </div>
    </main>
  );
}