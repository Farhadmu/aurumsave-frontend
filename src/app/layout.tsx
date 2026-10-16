import './globals.css';
import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '../lib/auth-context';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AiAssistantModal from '../components/AiAssistantModal';

export const metadata: Metadata = {
  title: 'AurumSave — Bangladesh Digital Gold Savings & Bullion Vault',
  description:
    'Save and invest in 24K and 22K physical allocated gold bullion in Bangladesh. Real-time BAJUS rates, bank-grade insured vaults, transparent spreads, and instant MFS liquidity via bKash and Nagad.',
  keywords: [
    'Digital Gold Bangladesh',
    'Gold Savings BDT',
    'BAJUS Gold Rate',
    '24K Gold Bar Dhaka',
    'bKash Gold Investment',
    'Nagad Gold Savings',
    'Allocated Bullion Vault',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-aurum-navy text-aurum-ivory antialiased selection:bg-aurum-gold selection:text-aurum-navy flex flex-col min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <AiAssistantModal />
        </AuthProvider>
      </body>
    </html>
  );
}
