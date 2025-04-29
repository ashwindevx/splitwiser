import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Splitwiser - Smart Bill Splitting App',
  description: 'Easily split bills with AI-powered item recognition and customizable sharing options',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  );
} 