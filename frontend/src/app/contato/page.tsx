import Link from "next/link";
import { ArrowLeft, MessageCircle, Mail } from "lucide-react";

export default function ContatoPage() {
  return (
    <main className="min-h-screen bg-as-black text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-1 text-sm text-as-gray-light hover:text-as-green mb-8">
          <ArrowLeft size={14} /> Voltar para a loja
        </Link>
        <h1 className="text-4xl font-black mb-6">Fale <span className="text-as-green">Conosco</span></h1>
        <p className="text-as-gray-light mb-8">Estamos prontos para te atender da melhor forma possível.</p>
        <div className="space-y-4">
          <a href="https://wa.me/5592985579850" target="_blank" className="flex items-center gap-4 bg-as-gray p-4 rounded-xl hover:bg-as-gray-light transition"><MessageCircle className="text-as-green" size={28} /><div><h3 className="font-bold">WhatsApp</h3><p className="text-sm text-as-gray-light">(92) 98557-9850</p></div></a>
          <a href="mailto:almservicos75@gmail.com" className="flex items-center gap-4 bg-as-gray p-4 rounded-xl hover:bg-as-gray-light transition"><Mail className="text-as-green" size={28} /><div><h3 className="font-bold">E-mail</h3><p className="text-sm text-as-gray-light">almservicos75@gmail.com</p></div></a>
        </div>
      </div>
    </main>
  );
}