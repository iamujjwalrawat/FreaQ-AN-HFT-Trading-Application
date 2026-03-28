import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FreaQ - Global HFT Trading Platform',
  description: 'Open-source high frequency trading platform with real-time data from all major global stock exchanges. Monitor, trade, and simulate across NYSE, NASDAQ, LSE, BSE, NSE, ASX & more.',
  keywords: ['HFT', 'trading', 'stocks', 'real-time', 'NYSE', 'NASDAQ', 'LSE', 'BSE', 'NSE', 'ASX', 'open source'],
  authors: [{ name: 'FreaQ Team' }],
  openGraph: {
    title: 'FreaQ - Global HFT Trading Platform',
    description: 'Real-time HFT monitoring across all world exchanges. Open source. Free forever.',
    type: 'website',
    url: 'https://freaq.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FreaQ - Global HFT Trading Platform',
    description: 'Real-time HFT monitoring across all world exchanges.',
  },
  icons: {
    icon: '/favicon.ico',
  },
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} bg-background text-text-primary antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
