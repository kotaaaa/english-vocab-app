"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/", label: "ダッシュボード", icon: "📊" },
  { href: "/words", label: "単語帳", icon: "📚" },
  { href: "/flashcard", label: "フラッシュカード", icon: "🃏" },
  { href: "/quiz", label: "クイズ", icon: "❓" },
  { href: "/progress", label: "進捗", icon: "📈" },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-indigo-700 text-white w-64 min-h-screen flex flex-col p-4 shrink-0">
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
  )
}
