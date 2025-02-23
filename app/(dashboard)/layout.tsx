import { TopNav } from "@/components/top-nav";
import type React from "react"; // Added import for React
import { getCurrentSession } from "@/lib/lucia";
import { redirect } from "next/navigation";
import { JaxProvider } from "../providers/jax-provider";

export const metadata = {
  title: "NumiQ",
  description: "Improve your math skills with NumiQ",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getCurrentSession();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <TopNav />
      <JaxProvider>{children}</JaxProvider>
    </div>
  );
}
