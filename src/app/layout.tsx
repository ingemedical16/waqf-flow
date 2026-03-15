import "./globals.scss";

export const metadata = {
  title: "WaqfFlow",
  description: "Mosque Donation Platform",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar">
      <body >
        {children}
      </body>
    </html>
  );
}