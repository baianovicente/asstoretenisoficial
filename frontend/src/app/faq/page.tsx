import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-as-black text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-1 text-sm text-as-gray-light hover:text-as-green mb-8">
          <ArrowLeft size={14} /> Voltar para a loja
        </Link>
        <h1 className="text-4xl font-black mb-6">Perguntas <span className="text-as-green">Frequentes</span></h1>
        <div className="space-y-4 text-as-gray-light">
          <details className="bg-as-gray p-4 rounded-lg cursor-pointer"><summary className="font-bold text-white">Quais são as formas de pagamento?</summary><p className="mt-2 text-sm">Aceitamos PIX (com 5% de desconto), cartão de crédito em até 12x sem juros e boleto bancário.</p></details>
          <details className="bg-as-gray p-4 rounded-lg cursor-pointer"><summary className="font-bold text-white">Qual é o prazo de entrega?</summary><p className="mt-2 text-sm">O prazo varia de 3 a 10 dias úteis, dependendo da sua região. Todos os pedidos têm código de rastreio.</p></details>
          <details className="bg-as-gray p-4 rounded-lg cursor-pointer"><summary className="font-bold text-white">Posso trocar ou devolver o produto?</summary><p className="mt-2 text-sm">Sim! Você tem até 7 dias corridos após o recebimento para solicitar troca ou devolução sem complicação.</p></details>
          <details className="bg-as-gray p-4 rounded-lg cursor-pointer"><summary className="font-bold text-white">Os produtos são originais?</summary><p className="mt-2 text-sm">Com certeza. Todos os nossos tênis passam por um rigoroso processo de verificação de autenticidade.</p></details>
        </div>
      </div>
    </main>
  );
}