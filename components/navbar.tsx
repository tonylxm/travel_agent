"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plane, LogOut } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const isPlannerPage = pathname?.startsWith("/planner")
  
  // Determine active tab based on pathname
  const getActiveTab = () => {
    if (pathname === "/planner/itinerary") return "itinerary"
    if (pathname === "/planner/flights") return "flights"
    if (pathname === "/planner/accommodation") return "accommodation"
    if (pathname === "/planner/activities") return "activities"
    if (pathname === "/planner/summary") return "review"
    return null
  }

  const activeTab = getActiveTab()

  const handleLogout = () => {
    // Non-functional for now
    console.log("Logout clicked")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Plane className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground text-lg">Obal.ai</span>
          </Link>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/planner"
              className={`px-4 py-2 text-sm font-medium transition ${
                pathname === "/planner"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Plan Trip
            </Link>
            {isPlannerPage && (
              <>
                <Link
                  href="/planner/itinerary"
                  className={`px-4 py-2 text-sm font-medium transition ${
                    activeTab === "itinerary"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Itinerary
                </Link>
                <Link
                  href="/planner/flights"
                  className={`px-4 py-2 text-sm font-medium transition ${
                    activeTab === "flights"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Flights
                </Link>
                <Link
                  href="/planner/accommodation"
                  className={`px-4 py-2 text-sm font-medium transition ${
                    activeTab === "accommodation"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Accommodation
                </Link>
                <Link
                  href="/planner/activities"
                  className={`px-4 py-2 text-sm font-medium transition ${
                    activeTab === "activities"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Activities
                </Link>
                <Link
                  href="/planner/summary"
                  className={`px-4 py-2 text-sm font-medium transition ${
                    activeTab === "review"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Review
                </Link>
              </>
            )}
          </nav>

          {/* Log Out Button */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Log Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

