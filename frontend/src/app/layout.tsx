import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider, LanguageProvider, AuthProvider } from "../contexts";

export const metadata: Metadata = {
  title: "DrogCine - Home",
  description: "DrogCine - Medical consultation app",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "DrogCine - Home",
    description: "DrogCine - Medical consultation app",
    url: "https://drogcine.netlify.app",
    siteName: "DrogCine",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>{children}</AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
