import { LocationProvider } from "@/components/LocationProvider";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import { TilesetProvider } from "@/components/TilesetProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trajectory Air",
  description: "Trajectory Air",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`h-full ${inter.className}`}>
        <Suspense>
          <ReactQueryProvider>
            <LocationProvider>
              <TilesetProvider>
                {children}
              </TilesetProvider>
            </LocationProvider>
          </ReactQueryProvider>
        </Suspense>
      </body>
    </html>
  );
}
