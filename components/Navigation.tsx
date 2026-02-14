"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/", label: "ホーム", icon: "📊" },
  { href: "/words", label: "単語帳", icon: "📚" },
  { href: "/flashcard", label: "カード", icon: "🃏" },
  { href: "/quiz", label: "クイズ", icon: "❓" },
  { href: "/progress", label: "進捗", icon: "📈" },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop: サイドバー */}
      <nav className="hidden md:flex bg-indigo-700 text-white w-64 min-h-screen flex-col p-4 shrink-0">
        <div className="mb-8">
          <h1 className="text-xl font-bold">英単語マスター</h1>
          <p className="text-indigo-300 text-sm mt-1">English Vocab App</p>
        </div>
        <ul className="space-y-2 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-indigo-900 text-white"
                      : "text-indigo-200 hover:bg-indigo-600 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
        <p className="text-indigo-400 text-xs text-center mt-4">
          データはローカルに保存されます
        </p>
      </nav>

      {/* Mobile: 下部タブバー */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
        <ul className="flex justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={`flex flex-col items-center py-2 px-1 transition-colors ${
                    isActive ? "text-indigo-600" : "text-gray-400"
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs mt-0.5 font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}
