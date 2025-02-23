import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import type React from "react";
import { AsyncProvider } from "./providers/async-provider";
import { ProgressProviders } from "./providers/progress-providers";

const inter = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "NumiQ",
  description: "Improve your math skills with NumiQ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AsyncProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            <ProgressProviders>
              <NuqsAdapter>{children}</NuqsAdapter>
            </ProgressProviders>
          </div>
          <Toaster />
        </AsyncProvider>
      </body>
    </html>
  );
}
