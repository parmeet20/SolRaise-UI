'use client'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
const AppWalletProvider = dynamic(()=>import('@/components/shared/AppWalletProvider'));
const Navbar = dynamic(()=>import('@/components/shared/Navbar'));
import { Provider } from "react-redux";
import { store } from "@/store";
import { Toaster } from "@/components/ui/toaster";
import dynamic from "next/dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning
      >
        <Provider store={store}>
          <AppWalletProvider>
            <Navbar />
            {children}
          </AppWalletProvider>
        </Provider>
        <Toaster/>
      </body>
    </html>
  );
}
