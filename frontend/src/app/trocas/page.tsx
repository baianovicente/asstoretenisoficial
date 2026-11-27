import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TrocasPage() {
  return (
    <main className="min-h-screen bg-as-black text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-1 text-sm text-as-gray-light hover:text-as-green mb-8">
          <ArrowLeft size={14} /> Voltar para a loja
        </Link>
        <h1 className="text-4xl font-black mb-6">Trocas e <span className="text-as-green">Devoluções</span></h1>
        <div className="space-y-6 text-as-gray-light leading-relaxed">
          <p>Nosso compromisso é com a sua satisfação. Se por algum motivo você não ficar satisfeito com sua compra, pode solicitar a troca ou devolução em até 7 dias corridos após o recebimento.</p>
          <h3 className="text-white font-bold text-xl mt-6">Como solicitar?</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Entre em contato pelo WhatsApp ou e-mail.</li>
            <li>Informe o número do pedido e o motivo da troca/devolução.</li>
            <li>Enviaremos as instruções para envio do produto.</li>
            <li>Após recebermos e verificarmos o produto, realizaremos a troca ou o estorno.</li>
          </ol>
          <p className="mt-4 text-sm italic">O produto deve estar sem sinais de uso, na embalagem original e com a etiqueta.</p>
        </div>
      </div>
    </main>
  );
}