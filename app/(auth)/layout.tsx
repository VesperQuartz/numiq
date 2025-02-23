import type React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center p-4 min-h-[calc(100vh-7rem)]">
      {children}
    </div>
  );
}
