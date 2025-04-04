"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, PlusCircle, Heart, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Discover",
      href: "/projects",
      icon: Search,
    },
    {
      name: "Create",
      href: "/create",
      icon: PlusCircle,
    },
    {
      name: "Saved",
      href: "/saved",
      icon: Heart,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center h-16 bg-background border-t max-w-md mx-auto">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        )
      })}
    </div>
  )
}

