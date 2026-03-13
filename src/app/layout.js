import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Labdrug Pharmacy - Sales & Inventory Management System',
  description: 'Complete pharmacy management solution for sales tracking, inventory monitoring, and expiration date management.',
  keywords: 'pharmacy, inventory management, sales system, expiration tracking, Labdrug Pharmacy',
  authors: [{ name: 'Labdrug Pharmacy' }],
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
          {children}
        </div>
      </body>
    </html>
  );
}