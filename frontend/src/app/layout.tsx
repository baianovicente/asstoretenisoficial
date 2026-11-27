import type { Metadata } from 'next';
import '../styles/globals.css';
import { CartProvider } from '@/contexts/CartContext';
import CartDrawer from '@/components/Cart/CartDrawer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import NewsletterPopup from '@/components/NewsletterPopup';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import RecentSalesToast from '@/components/RecentSalesToast';

export const metadata: Metadata = {
  title: 'Asstore Tênis Oficial — Os tênis mais desejados do Brasil',
  description:
    'Sneakers premium com autenticidade garantida, frete expresso e 5% OFF no PIX. Compre na Asstore Tênis Oficial. Atendimento: (92) 98557-9850.',
  keywords: ['tênis', 'sneakers', 'nike', 'adidas', 'puma', 'new balance', 'manaus', 'amazonas'],
  openGraph: {
    title: 'Asstore Tênis Oficial',
    description: 'Os tênis mais desejados do Brasil com 5% OFF no PIX.',
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <CartProvider>
          {children}
          <CartDrawer />
          <WhatsAppFloat />
          <NewsletterPopup />
          <ExitIntentPopup />
          <RecentSalesToast />
        </CartProvider>
      </body>
    </html>
  );
}
