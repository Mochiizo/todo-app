import type { Metadata } from "next";
import { Geist_Mono, Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import AppShell from "@/components/app-shell";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baloo2 = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Gestion de listes de tâches",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${nunito.variable} ${geistMono.variable} ${baloo2.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#0b1b3a]">
        <AppShell>{children}</AppShell>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
