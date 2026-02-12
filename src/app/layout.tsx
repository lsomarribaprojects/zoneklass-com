import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ZoneKlass - Community',
  description: 'The place for learning and growth',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Sidebar />
        <Header />
        <main
          style={{
            marginLeft: 'var(--sidebar-width)',
            paddingTop: 'var(--header-height)', /* Use paddingTop instead of margin to prevent collapse issues if header is fixed */
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div className="container" style={{ padding: '2rem 1rem', flex: 1 }}>
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
