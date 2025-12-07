import "./globals.css";
import ToasterProvider from "@/components/ToasterProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AOSWrapper from "@/components/AOSWrapper";

export const metadata = {
  title: "LMS Platform",
  description: "Best LMS built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AOSWrapper />   {/* ✔ AOS Initialized */}
        <ToasterProvider />
        <Navbar />
        <div className="pt-20">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
