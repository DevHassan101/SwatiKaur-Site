import type { Metadata } from "next";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ActionButtons from "./components/ActionButtons";

export const metadata: Metadata = {
  title: "Swati-Kaur",
  description: "Developed by ByteCloude",
};

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <ActionButtons />
      <Footer />
    </>
  );
}
