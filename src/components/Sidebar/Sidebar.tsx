'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

// 引入圖標
import BidOptimizerIcon from './icons/BidOptimizerIcon'
import CampaignGroupsIcon from './icons/CampaignGroupsIcon'
import ReduceAdWasteIcon from './icons/ReduceAdWasteIcon'
import ConnectionsIcon from './icons/ConnectionsIcon'
import CollapseIcon from './icons/CollapseIcon'
import ExpandIcon from './icons/ExpandIcon'
import LogoutIcon from './icons/LogoutIcon'
import UserIcon from './icons/UserIcon'

type SidebarProps = {
  className?: string
}

const Sidebar = ({ className = '' }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  // 處理響應式設計
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize() // 初始檢查
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 切換側邊欄狀態
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  // 關閉用戶菜單
  const closeUserMenu = () => {
    setShowUserMenu(false)
  }

  // 處理登出
  const handleSignOut = async () => {
    await signOut()
    closeUserMenu()
  }

  // 主菜單項目
  const mainMenuItems = [
    {
      name: 'Bid Optimizer',
      icon: <BidOptimizerIcon />,
      path: '/dashboard',
      badge: null,
    },
    {
      name: 'Campaign Groups',
      icon: <CampaignGroupsIcon />,
      path: '/campaign-groups',
      badge: null,
    },
  ]

  // 目標菜單項目
  const objectivesMenuItems = [
    {
      name: 'Reduce Ad Waste',
      icon: <ReduceAdWasteIcon />,
      path: '/objectives/reduce-ad-waste',
      badge: '6',
    },
  ]

  // 底部菜單項目
  const bottomMenuItems = [
    {
      name: 'Connections',
      icon: <ConnectionsIcon />,
      path: '/connections',
      badge: null,
    },
  ]

  // 確定元素是否為活動狀態
  const isActive = (path: string) => pathname === path

  // 菜單項目元件
  const MenuItem = ({ item, isCompact = false }: { item: typeof mainMenuItems[0], isCompact?: boolean }) => (
    <Link
      href={item.path}
      className={`flex items-center py-2 px-3 rounded-lg transition-colors duration-200 group ${
        isActive(item.path)
          ? 'bg-gray-100 text-gray-900 font-medium'
          : 'text-gray-700 hover:bg-gray-100'
      } ${isCompact ? 'justify-center' : 'space-x-3'}`}
      title={isCompact ? item.name : undefined}
    >
      <span className="text-gray-600">{item.icon}</span>
      {!isCompact && (
        <>
          <span className="flex-grow">{item.name}</span>
          {item.badge && (
            <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {item.badge}
            </span>
          )}
        </>
      )}
      {isCompact && item.badge && (
        <span className="absolute -right-1 -top-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {item.badge}
        </span>
      )}
    </Link>
  )

  // 如果是移動設備且已收攏
  const mobileCollapsed = isMobile && isCollapsed

  return (
    <aside
      className={`flex flex-col ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${mobileCollapsed ? 'h-16' : 'h-screen'} bg-white border-r border-gray-200 transition-all duration-300 ${className}`}
    >
      {/* 在移動設備上，垂直方向的摺疊/展開按鈕 */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="absolute right-3 top-3 md:hidden z-10"
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ExpandIcon vertical /> : <CollapseIcon vertical />}
        </button>
      )}

      {/* 頂部區域 - Logo 和收攏按鈕 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Link
          href="/dashboard"
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'}`}
        >
          <div className="flex justify-center items-center w-8 h-8 rounded bg-red-600 text-white font-bold text-lg">
            T
          </div>
          {!isCollapsed && <span className="font-semibold text-lg">TransBiz</span>}
        </Link>

        {/* 只在非移動設備上顯示水平折疊按鈕 */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700"
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ExpandIcon /> : <CollapseIcon />}
          </button>
        )}
      </div>

      {/* 如果在移動設備上且已收攏，不顯示其餘部分 */}
      {!mobileCollapsed && (
        <>
          {/* 主要菜單 */}
          <div className="flex-grow overflow-y-auto p-3 space-y-1">
            <div className="space-y-1">
              {mainMenuItems.map((item) => (
                <MenuItem key={item.name} item={item} isCompact={isCollapsed} />
              ))}
            </div>

            {/* 目標類別 */}
            <div className="mt-6">
              <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ${
                isCollapsed ? 'sr-only' : ''
              }`}>
                OBJECTIVES
              </h3>
              <div className="space-y-1">
                {objectivesMenuItems.map((item) => (
                  <MenuItem key={item.name} item={item} isCompact={isCollapsed} />
                ))}
              </div>
            </div>
          </div>

          {/* 底部菜單 */}
          <div className="p-3 border-t border-gray-200 space-y-1">
            {bottomMenuItems.map((item) => (
              <MenuItem key={item.name} item={item} isCompact={isCollapsed} />
            ))}

            {/* 用戶菜單 */}
            <div className="relative">
              <button
                className={`flex items-center py-2 px-3 w-full rounded-lg transition-colors duration-200 text-gray-700 hover:bg-gray-100 ${
                  isCollapsed ? 'justify-center' : 'space-x-3'
                }`}
                onClick={() => setShowUserMenu(!showUserMenu)}
                title={isCollapsed ? 'User Menu' : undefined}
              >
                <span className="text-gray-600">
                  <UserIcon />
                </span>
                {!isCollapsed && (
                  <span className="flex-grow truncate">
                    {user?.user_metadata?.display_name || 'User'}
                  </span>
                )}
              </button>

              {/* 用戶下拉菜單 */}
              {showUserMenu && (
                <div className={`absolute bottom-full ${
                  isCollapsed ? 'left-full ml-2 mb-0' : 'left-0 mb-2'
                } bg-white shadow-lg rounded-lg border border-gray-200 w-48 py-1 z-10`}>
                  <div className="px-4 py-2 border-b border-gray-200">
                    <div className="font-medium">{user?.user_metadata?.display_name || 'User'}</div>
                    <div className="text-sm text-gray-500 truncate">{user?.email}</div>
                  </div>
                  <button
                    className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                    onClick={handleSignOut}
                  >
                    <LogoutIcon />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </aside>
  )
}

export default Sidebar
