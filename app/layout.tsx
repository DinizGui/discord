import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { AppSessionProvider } from "@/components/session-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Aura",
    template: "%s | Aura",
  },
  description: "Conecte-se com comunidades através de conversas em tempo real.",
  applicationName: "Aura",
  keywords: [
    "chat",
    "comunidade",
    "tempo real",
    "mensagens",
    "servidores",
    "next.js",
  ],
  authors: [{ name: "Seu Nome" }],
  creator: "Seu Nome",
  metadataBase: new URL("https://seusite.com"),
  openGraph: {
    title: "Aura",
    description: "Conecte-se com comunidades através de conversas em tempo real.",
    url: "https://seusite.com",
    siteName: "Aura",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aura",
    description: "Conecte-se com comunidades através de conversas em tempo real.",
  },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-violet-500/30 selection:text-white`}
      >
        <div className="relative min-h-screen overflow-x-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(120,119,198,0.15),_transparent_35%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.12),_transparent_30%)]" />
          <AppSessionProvider>
            {children}
            <Toaster richColors position="top-center" />
          </AppSessionProvider>
        </div>
        <Analytics />
      </body>
    </html>
  );
}