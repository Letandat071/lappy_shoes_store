import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lappy Shoes - Premium Shoe Store',
  description: 'Find your perfect pair of shoes at Lappy Shoes',
  icons: {
    icon: '/lappy.ico'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lappy-shoes.vercel.app/',
    siteName: 'Lappy Shoes',
    title: 'Lappy Shoes - Premium Shoe Store',
    description: 'Find your perfect pair of shoes at Lappy Shoes',
    images: [
      {
        url: 'https://cdn.donmai.us/original/fd/5e/__texas_lappland_texas_and_lappland_the_decadenza_arknights_drawn_by_xhongxi__fd5e73bbedeefc7e534f29315e07b2fc.png',
        width: 1200,
        height: 630,
        alt: 'Lappy Shoes Banner'
      }
    ],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
