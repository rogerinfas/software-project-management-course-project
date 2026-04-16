import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DemoDataProvider } from "@/context/demo-data-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IEP Madre Santa Beatriz — Gestión administrativa",
  description:
    "Institución Educativa Madre Santa Beatriz (Arequipa). Prototipo: admisión, tesorería, asistencia, comunicación y reportes.",
  icons: { icon: "/logo-iep-madre-santa-beatriz.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <DemoDataProvider>
              {children}
              <Toaster richColors position="top-center" />
            </DemoDataProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
