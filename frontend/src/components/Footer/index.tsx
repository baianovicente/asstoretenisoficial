import Link from 'next/link';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-as-gray mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-lg font-black mb-3 leading-none">
            <span className="text-as-green">Asstore</span>
            <span className="text-white">tenisoficial</span>
          </h4>
          <p className="text-sm text-as-gray-light mt-2">
            Tênis oficiais com autenticidade garantida, frete expresso para todo o Brasil e atendimento humano.
          </p>
        </div>

        <div>
          <h5 className="font-bold mb-3 text-sm uppercase tracking-wider">Loja</h5>
          <ul className="space-y-2 text-sm text-as-gray-light">
            <li><Link href="/categoria/masculino" className="hover:text-as-green">Masculino</Link></li>
            <li><Link href="/categoria/feminino" className="hover:text-as-green">Feminino</Link></li>
            <li><Link href="/categoria/lancamentos" className="hover:text-as-green">Lançamentos</Link></li>
            <li><Link href="/categoria/promocoes" className="hover:text-as-green">Promoções</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold mb-3 text-sm uppercase tracking-wider">Ajuda</h5>
          <ul className="space-y-2 text-sm text-as-gray-light">
            <li><Link href="/faq" className="hover:text-as-green">FAQ</Link></li>
            <li><Link href="/trocas" className="hover:text-as-green">Trocas e Devoluções</Link></li>
            <li><Link href="/privacidade" className="hover:text-as-green">Política de Privacidade</Link></li>
            <li><Link href="/contato" className="hover:text-as-green">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold mb-3 text-sm uppercase tracking-wider">Contato</h5>
          <ul className="space-y-2 text-sm text-as-gray-light">
            <li className="flex items-center gap-2">
              <Phone size={14} className="text-as-green shrink-0" />
              <a href="tel:+5592985579850" className="hover:text-as-green">(92) 98557-9850</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-as-green shrink-0" />
              <a href="mailto:almservicos75@gmail.com" className="hover:text-as-green break-all">
                almservicos75@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={14} className="text-as-green shrink-0 mt-0.5" />
              <span>Av. Desembargador João Machado, 597 - Loja 8, Alvorada, Manaus/AM - CEP 69.043-000</span>
            </li>
            <li className="flex gap-3 mt-3">
              <a href="#" aria-label="Instagram" className="hover:text-as-green"><Instagram size={18} /></a>
              <a href="#" aria-label="Facebook" className="hover:text-as-green"><Facebook size={18} /></a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-as-gray py-4 text-center text-xs text-as-gray-light space-y-1">
        <p>© {new Date().getFullYear()} Asstore Tênis Oficial — Todos os direitos reservados.</p>
        <p>A L M SERVICOS E LOGISTICA LTDA — CNPJ: 22.526.047/0001-26</p>
      </div>
    </footer>
  );
}
