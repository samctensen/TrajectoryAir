import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trajectory Air",
  description: "Trajectory Air",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <nav className="bg-mapgrey p-4 border-b-2 border-black">
          <ul className="flex justify-between items-center list-none m-0 p-0">
            <li className="nav-item">
              <a href="/" className="text-white no-underline">Trajectory Air</a>
            </li>
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}
