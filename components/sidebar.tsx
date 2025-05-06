"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  ChevronDown,
  Settings,
  User,
  LogOut,
  PanelLeft,
  PanelRight,
  TrendingDown,
  Mail,
  LineChart,
  Layers,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/contexts/AuthContext"

interface NavItemProps {
  href: string
  icon: React.ElementType
  label: string
  isActive?: boolean
  isCollapsed?: boolean
  badge?: number | string
  children?: React.ReactNode
}

const NavItem = ({ href, icon: Icon, label, isActive, isCollapsed, badge, children }: NavItemProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = Boolean(children)

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "buff-nav-link w-full justify-between",
            isActive ? "buff-nav-link-active" : "buff-nav-link-inactive",
          )}
        >
          <span className="flex items-center">
            <Icon className="mr-3 h-4 w-4" />
            {!isCollapsed && <span>{label}</span>}
          </span>
          {!isCollapsed && <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />}
        </button>
        {isOpen && !isCollapsed && <div className="pl-9 space-y-1">{children}</div>}
      </div>
    )
  }

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={href}
              className={cn(
                "buff-nav-link justify-center w-full relative flex items-center justify-center",
                isActive ? "buff-nav-link-active" : "buff-nav-link-inactive",
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {badge > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white shadow-sm">
                    {badge}
                  </span>
                )}
              </div>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            {label}
            {badge && <span className="ml-1">({badge})</span>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center h-9 px-3 py-2 text-sm rounded-md hover:bg-gray-100",
        isActive ? "bg-gray-100 font-medium" : "text-gray-700",
      )}
    >
      <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
      <span className="text-sm">{label}</span>
      {badge > 0 && (
        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
          {badge}
        </span>
      )}
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, signOut } = useAuth()

  // Refs for click outside detection
  const userMenuRef = useRef<HTMLDivElement>(null)
  const userButtonRef = useRef<HTMLButtonElement>(null)

  // Get user data from AuthContext
  const username = user?.user_metadata?.name || user?.email?.split('@')[0] || "User"
  const userEmail = user?.email || "user@example.com"

  const handleLogout = async () => {
    try {
      await signOut()
      // AuthContext 的 signOut 已經包含重定向到首頁的邏輯
    } catch (error) {
      console.error("sign out error:", error)
    }
  }

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isUserMenuOpen &&
        userMenuRef.current &&
        userButtonRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        !userButtonRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false)
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside)

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isUserMenuOpen])

  return (
    <div
      className={cn(
        "flex flex-col h-full border-r bg-white transition-all duration-300",
        isCollapsed ? "w-[80px]" : "w-[240px]",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <Link
          href="/objectives/reduce-ad-waste"
          className={cn("flex items-center gap-2", isCollapsed && "justify-center w-full")}
        >
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">T</div>
          {!isCollapsed && <span className="font-bold text-xl">TransBiz</span>}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3">
        {isCollapsed ? (
          <div className="flex flex-col items-center justify-center gap-8 w-full">
            <NavItem
              href="/bid-optimizer"
              icon={LineChart}
              label="Bid Optimizer"
              isActive={pathname === "/bid-optimizer"}
              isCollapsed={isCollapsed}
            />
            <NavItem
              href="/campaign-groups"
              icon={Layers}
              label="Campaign Groups"
              isActive={pathname === "/campaign-groups"}
              isCollapsed={isCollapsed}
            />
            <NavItem
              href="/objectives/reduce-ad-waste"
              icon={TrendingDown}
              label="Reduce Ad Waste"
              isActive={pathname === "/objectives/reduce-ad-waste" || pathname.includes("/strategy")}
              isCollapsed={isCollapsed}
              badge={6}
            />
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="space-y-1">
                <NavItem
                  href="/bid-optimizer"
                  icon={LineChart}
                  label="Bid Optimizer"
                  isActive={pathname === "/bid-optimizer"}
                  isCollapsed={isCollapsed}
                />
                <NavItem
                  href="/campaign-groups"
                  icon={Layers}
                  label="Campaign Groups"
                  isActive={pathname === "/campaign-groups"}
                  isCollapsed={isCollapsed}
                />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                OBJECTIVES
              </h3>
              <div className="space-y-1">
                <NavItem
                  href="/objectives/reduce-ad-waste"
                  icon={TrendingDown}
                  label="Reduce Ad Waste"
                  isActive={pathname === "/objectives/reduce-ad-waste" || pathname.includes("/strategy")}
                  isCollapsed={isCollapsed}
                  badge={6}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="border-t p-3">
        {isCollapsed && (
          <div className="flex flex-col items-center">
            <div className="relative">
              <Button
                ref={userButtonRef}
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <User className="h-5 w-5" />
              </Button>

              {isUserMenuOpen && (
                <div
                  ref={userMenuRef}
                  className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-white rounded-md shadow-md border w-48 z-50 overflow-hidden"
                  style={{ maxHeight: "calc(100vh - 100px)" }}
                >
                  <div className="p-3 border-b bg-gray-50">
                    <div className="font-medium text-sm">{username}</div>
                    <div className="text-xs text-gray-500 flex items-center mt-1">
                      <Mail className="h-3 w-3 mr-1" />
                      {userEmail}
                    </div>
                  </div>
                  <div className="p-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 mt-2 flex items-center justify-center"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  >
                    <PanelRight className="h-4 w-4" />
                    <span className="sr-only">Expand Sidebar</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Expand Sidebar</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {!isCollapsed && (
          <div className="space-y-1">
            <NavItem
              href="/connections"
              icon={Settings}
              label="Connections"
              isActive={pathname === "/connections"}
              isCollapsed={isCollapsed}
            />

            <div className="flex items-center justify-between relative">
              <Button
                ref={userButtonRef}
                variant="ghost"
                className="flex-1 justify-start px-3 py-2 h-9 text-sm font-normal"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <User className="h-4 w-4 mr-2" />
                <span className="text-sm">{username}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 flex items-center justify-center"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <PanelLeft className="h-4 w-4" />
                <span className="sr-only">Collapse Sidebar</span>
              </Button>

              {isUserMenuOpen && (
                <div
                  ref={userMenuRef}
                  className="absolute left-0 bottom-full mb-2 bg-white rounded-md shadow-md border w-48 z-50 overflow-hidden"
                >
                  <div className="p-3 border-b bg-gray-50">
                    <div className="font-medium text-sm">{username}</div>
                    <div className="text-xs text-gray-500 flex items-center mt-1">
                      <Mail className="h-3 w-3 mr-1" />
                      {userEmail}
                    </div>
                  </div>
                  <div className="p-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
