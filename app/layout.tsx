import type { Metadata } from "next";
import { CartProvider } from "@/app/context/CartContext";
import { Inter, Jura } from "next/font/google";
import "./globals.css";

const jura = Jura({
  subsets: ["latin"],
  variable: "--font-jura",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Puca Coast",
  description: "Generated by create next app",
  icons: [
    {
      url: "/favicon.ico",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jura.variable}`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
