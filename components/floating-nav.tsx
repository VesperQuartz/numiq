import Link from "next/link"
import { usePathname } from "next/navigation"

export function FloatingNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 backdrop-blur-md rounded-full p-2 z-50">
      <ul className="flex space-x-4">
        <li>
          <Link
            href="/"
            className={`px-4 py-2 rounded-full text-white hover:bg-white hover:bg-opacity-20 transition-colors ${pathname === "/" ? "bg-white bg-opacity-20" : ""}`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/practice"
            className={`px-4 py-2 rounded-full text-white hover:bg-white hover:bg-opacity-20 transition-colors ${pathname === "/practice" ? "bg-white bg-opacity-20" : ""}`}
          >
            Practice
          </Link>
        </li>
        <li>
          <Link
            href="/leaderboard"
            className={`px-4 py-2 rounded-full text-white hover:bg-white hover:bg-opacity-20 transition-colors ${pathname === "/leaderboard" ? "bg-white bg-opacity-20" : ""}`}
          >
            Leaderboard
          </Link>
        </li>
      </ul>
    </nav>
  )
}

