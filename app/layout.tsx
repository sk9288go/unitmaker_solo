import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
  title: "Unitmaker - 나만의 공간 설계",
  description: "다양한 유닛 조합을 통해 나만의 공간을 만들어 보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <LanguageProvider>
          <Header />
          <main style={{ paddingTop: '88px' }}>
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
