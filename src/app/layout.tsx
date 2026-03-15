import "./globals.css";
import { Amiri } from "next/font/google";

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic",
});

export const metadata = {
  title: "WaqfFlow",
  description: "Mosque Donation Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar">
      <body className={amiri.variable}>
        {children}
      </body>
    </html>
  );
}