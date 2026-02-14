import type { Metadata, Viewport } from "next"
import "./globals.css"
import Navigation from "@/components/Navigation"

export const metadata: Metadata = {
  title: "英単語マスター",
  description: "英語単語暗記アプリ",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "英単語マスター",
  },
  icons: {
    apple: "/icon-192.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#4338ca",
  width: "device-width",
  initialScale: 1,
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
