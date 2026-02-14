import type { Metadata } from "next"
import "./globals.css"
import Navigation from "@/components/Navigation"

export const metadata: Metadata = {
  title: "英単語マスター",
  description: "英語単語暗記アプリ",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="flex bg-gray-50 min-h-screen">
        <Navigation />
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </body>
    </html>
  )
}
