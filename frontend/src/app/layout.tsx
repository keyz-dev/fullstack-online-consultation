import type { Metadata } from "next";
import "./globals.css";
import {
  ThemeProvider,
  LanguageProvider,
  AuthProvider,
  SocketProvider,
  NotificationProvider,
} from "../contexts";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

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
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
        >
          <ThemeProvider>
            <LanguageProvider>
              <AuthProvider>
                <NotificationProvider>
                  <SocketProvider>
                    <ToastContainer />
                    {children}
                  </SocketProvider>
                </NotificationProvider>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
