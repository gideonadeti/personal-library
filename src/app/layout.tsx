import type { Metadata } from "next";
import { ClerkProvider, SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import localFont from "next/font/local";

import "./globals.css";
import { H2, H4 } from "./components/custom-tags";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Personal Library",
  description: "A web app that helps you manage your books",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <SignedIn>{children}</SignedIn>
          <SignedOut>
            <div className="flex flex-col md:flex-row items-center justify-around gap-8 h-screen overflow-y-auto p-8">
              <div className="flex flex-col text-center lg:text-left">
                <H2>Welcome to Personal Library</H2>
                <H4>A web app that helps you manage you books</H4>
              </div>
              <div className="flex items-center justify-center">
                <SignIn />
              </div>
            </div>
          </SignedOut>
        </ClerkProvider>
      </body>
    </html>
  );
}
