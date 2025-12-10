import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NVuti Mini App",
  description: "Телеграм мини-игра с верификацией SHA-512"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
