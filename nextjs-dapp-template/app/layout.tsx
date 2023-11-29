import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
/* import packageJson from '@/package.json';
import { Github } from 'lucide-react'; */
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
/* import { ModeToggle } from '@/components/mode-toggle'; */
import { ElvenInit } from '@/components/elven-ui/elven-init';
/* import { LoginModalButton } from '@/components/elven-ui/login-modal-button';
import Link from 'next/link'; */

const inter = Inter({ subsets: ['latin'] });

const dappHostname = process.env.NEXT_PUBLIC_DAPP_HOST;
const globalTitle = 'MultiversX';
const globalDescription =
  ' MultiversX blockchain.';
const globalImage = `${dappHostname}/og-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(dappHostname!),
  title: globalTitle,
  description: globalDescription,
  authors: { name: '', url: '' },
  openGraph: {
    title: globalTitle,
    images: [globalImage],
    description: globalDescription,
    type: 'website',
    url: dappHostname,
  },
  twitter: {
    title: globalTitle,
    description: globalDescription,
    images: [globalImage],
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const bodyStyle = {
    backgroundImage: 'url("/BG21.png")',
    backgroundSize: 'cover', // Adjust based on your needs
    backgroundPosition: 'center', // Adjust based on your needs
  };
  return (
    <html lang="en">
      <body className={inter.className} style={bodyStyle}>
        <ElvenInit />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="container mx-auto">
            <div className="w-full flex items-center justify-between flex-wrap gap-2 py-9 flex-col lg:flex-row">
              
              <div className="flex items-center gap-5">
              

              </div>
            </div>
          </div>
          <div className="container mx-auto min-h-[calc(100vh-280px)] lg:min-h-[calc(100vh-235px)]">
            {children}
          </div>
        
        </ThemeProvider>
      </body>
    </html>
  );
}
