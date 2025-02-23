"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 backdrop-blur-md rounded-full p-2 z-50">
      <div className="flex items-center space-x-1">
        <Link
          href="/"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            pathname === "/"
              ? "text-white bg-indigo-600"
              : "text-gray-300 hover:text-white hover:bg-indigo-600"
          }`}
        >
          Home
        </Link>
        <Link
          href="/practice"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            pathname === "/practice"
              ? "text-white bg-indigo-600"
              : "text-gray-300 hover:text-white hover:bg-indigo-600"
          }`}
        >
          Practice
        </Link>
        <Link
          href="/leaderboard"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            pathname === "/leaderboard"
              ? "text-white bg-indigo-600"
              : "text-gray-300 hover:text-white hover:bg-indigo-600"
          }`}
        >
          Leaderboard
        </Link>
        <Link
          href="/sign-in"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            pathname === "/sign-in"
              ? "text-white bg-indigo-600"
              : "text-gray-300 hover:text-white hover:bg-red-600"
          }`}
        >
          Log out
        </Link>
      </div>
    </nav>
  );
}
