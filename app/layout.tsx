import type {Metadata} from 'next';
import Script from 'next/script';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'TSU CDES',
  description: 'TSU CDES',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body suppressHydrationWarning className="antialiased">
        {children}
        <Script src="https://js.puter.com/v2/" strategy="afterInteractive" crossOrigin="anonymous" />
      </body>
    </html>
  );
}
