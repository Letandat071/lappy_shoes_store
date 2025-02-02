import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lappy Shoes',
  description: 'Premium Shoe Store',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 2000,
                  style: {
                    background: '#333',
                    color: '#fff',
                  },
                  success: {
                    iconTheme: {
                      //màu xanh lá
                      primary: '#4CAF50', //xanh lá
                      secondary: '#333',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#FF0000',
                      secondary: '#333',
                    },
                  }
                }}
              />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
