import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-as-black text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-1 text-sm text-as-gray-light hover:text-as-green mb-8">
          <ArrowLeft size={14} /> Voltar para a loja
        </Link>
        <h1 className="text-4xl font-black mb-6">Política de <span className="text-as-green">Privacidade</span></h1>
        <div className="space-y-4 text-as-gray-light leading-relaxed text-sm">
          <p>A Asstore Tênis Oficial respeita a sua privacidade e está comprometida com a proteção dos seus dados pessoais, em conformidade com a LGPD (Lei Geral de Proteção de Dados).</p>
          <h3 className="text-white font-bold text-lg mt-6">Coleta de Dados</h3>
          <p>Coletamos apenas as informações necessárias para processar seus pedidos e melhorar sua experiência de compra, como nome, e-mail, endereço e dados de pagamento.</p>
          <h3 className="text-white font-bold text-lg mt-6">Uso das Informações</h3>
          <p>Seus dados são utilizados para: processar e entregar pedidos, enviar atualizações sobre o status, responder a solicitações de suporte e, se autorizado, enviar ofertas e novidades.</p>
          <h3 className="text-white font-bold text-lg mt-6">Seus Direitos</h3>
          <p>Você tem o direito de acessar, corrigir ou excluir seus dados a qualquer momento. Para exercer esses direitos, basta entrar em contato pelo nosso canal de atendimento.</p>
        </div>
      </div>
    </main>
  );
}