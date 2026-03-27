import type { Metadata } from "next";
import {Outfit} from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Swati-Kaur",
  description: "Developed by Swati-Kaur",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" data-arp="en" cz-shortcut-listen="true">
      <body className={outfit.className} >
        {children}
      </body>
    </html>
  );
}