import './globals.css';
import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '../lib/theme-context';
import { AuthProvider } from '../lib/auth-context';
import { LanguageProvider } from '../lib/language-context';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileNavDock from '../components/MobileNavDock';
import AiAssistantModal from '../components/AiAssistantModal';

export const metadata: Metadata = {
  title: 'AurumSave — Bangladesh Sovereign Digital Gold Savings & Bullion Vault',
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
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body className="bg-aurum-midnight text-aurum-text antialiased selection:bg-aurum-gold selection:text-aurum-midnight flex flex-col min-h-screen pb-14 md:pb-0">
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <MobileNavDock />
              <AiAssistantModal />
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
