"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
              <Search className="h-5 w-5 text-white" />
            </div>
            <span className="hidden font-semibold text-white sm:inline font-serif">VoyageAI</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-white hover:text-white/80 transition font-serif">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-white hover:text-white/80 transition font-serif">
              How it works
            </a>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            <Link href="/planner">
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white border-0 rounded-lg font-serif">
                Start Planning
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
