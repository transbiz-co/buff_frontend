'use client'

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
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
  onExpandChange?: (expanded: boolean) => void
}

const Sidebar = ({ className = '', onExpandChange }: SidebarProps) => {
  const [isMobile, setIsMobile] = useState(() => {
    // 初始化時檢查是否為移動端
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768
    }
    return false
  })

  const [isCollapsed, setIsCollapsed] = useState(() => {
    // 從 localStorage 讀取狀態，如果是移動端則預設為收攏
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) {
        return true
      }
      const saved = localStorage.getItem('sidebarCollapsed')
      return saved ? JSON.parse(saved) : false
    }
    return false
  })

  const [showUserMenu, setShowUserMenu] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()

  // 處理響應式設計
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768
      const wasNotMobile = !isMobile
      
      // 更新移動端狀態
      setIsMobile(isMobileView)
      
      // 當從桌面轉到移動端時自動收合
      if (isMobileView && wasNotMobile) {
        setIsCollapsed(true)
      } 
      // 從移動端轉到桌面端時恢復保存的狀態
      else if (!isMobileView && !wasNotMobile) {
        const saved = localStorage.getItem('sidebarCollapsed')
        setIsCollapsed(saved ? JSON.parse(saved) : false)
      }
    }

    handleResize() // 初始檢查
    
    // 使用 resize 防抖以提高性能
    let debounceTimeout: ReturnType<typeof setTimeout>
    const debouncedHandleResize = () => {
      clearTimeout(debounceTimeout)
      debounceTimeout = setTimeout(handleResize, 100)
    }
    
    window.addEventListener('resize', debouncedHandleResize)
    return () => {
      window.removeEventListener('resize', debouncedHandleResize)
      clearTimeout(debounceTimeout)
    }
  }, [isMobile])

  // 當展開狀態改變時通知父組件
  useEffect(() => {
    if (isMobile) {
      onExpandChange?.(!isCollapsed)
    } else {
      onExpandChange?.(false)
    }
  }, [isCollapsed, isMobile, onExpandChange])

  // 監聽路由變化，在移動端時自動收攏 sidebar
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true)
    }
  }, [pathname, isMobile])

  // 切換側邊欄狀態
  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    // 只在非移動端時保存狀態
    if (!isMobile) {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(newState))
    }
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
      path: '/bid-optimizer',
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

  // 菜單項目型別定義
  type MenuItem = {
    name: string;
    icon: React.ReactNode;
    path: string;
    badge: string | null;
  }

  // 菜單項目元件
  const MenuItem = ({ item, isCompact = false }: { item: MenuItem, isCompact?: boolean }) => {
    // 處理點擊事件
    const handleClick = (e: React.MouseEvent) => {
      // 如果是移動端，點擊後自動收攏 sidebar
      if (isMobile && !isCollapsed) {
        e.preventDefault() // 防止立即跳轉
        setIsCollapsed(true)
        // 使用 Next.js router 進行導航
        setTimeout(() => {
          router.push(item.path)
        }, 300)
      }
    }

    return (
      <Link
        href={item.path}
        onClick={handleClick}
        className={`flex items-center h-10 px-3 rounded-lg transition-colors duration-200 group ${
          isActive(item.path)
            ? 'bg-gray-100 text-gray-900 font-medium'
            : 'text-gray-700 hover:bg-gray-100'
        } ${isCompact ? 'justify-center' : 'space-x-3'} relative`}
        title={isCompact ? item.name : undefined}
      >
        <span className="text-gray-600 flex items-center">{item.icon}</span>
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
          <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
            {item.badge}
          </span>
        )}
      </Link>
    )
  }

  // 獲取當前活動頁面的名稱
  const getActivePageName = () => {
    const activeItem = [...mainMenuItems, ...objectivesMenuItems, ...bottomMenuItems]
      .find(item => isActive(item.path))
    return activeItem?.name || 'Dashboard'
  }

  return (
    <aside
      className={`flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isMobile
          ? `fixed top-0 left-0 right-0 z-50 ${
              isCollapsed
                ? 'h-16 shadow-sm'
                : 'h-screen shadow-lg'
            }`
            : `${isCollapsed ? 'w-16' : 'w-64'} h-screen relative`
      } ${className}`}
    >
      {/* 移動端頂部欄 */}
      <div className={`flex items-center justify-between px-4 ${isMobile ? 'h-16' : 'h-[60px]'} border-b border-gray-200`}>
        <Link
          href="/bid-optimizer"
          className={`flex items-center space-x-2 ${isMobile ? 'scale-90' : ''}`}
        >
          <div className="flex justify-center items-center w-8 h-8 rounded bg-red-600 text-white font-bold text-lg">
            T
          </div>
          {(!isCollapsed || isMobile) && <span className="font-semibold text-lg">TransBiz</span>}
        </Link>

        {/* 移動端當前頁面標題 */}
        {isMobile && (
          <div className="flex items-center space-x-3">
            <span className="text-gray-700 font-medium">{getActivePageName()}</span>
            <button
              onClick={toggleSidebar}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ExpandIcon vertical /> : <CollapseIcon vertical />}
            </button>
          </div>
        )}

        {/* 桌面端摺疊按鈕 */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="absolute -right-7 z-10"
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ExpandIcon /> : <CollapseIcon />}
          </button>
        )}
      </div>

      {/* 主要內容區域 - 在移動端時只在展開狀態顯示 */}
      {(!isMobile || !isCollapsed) && (
        <div className={`flex-grow overflow-y-auto transition-all duration-300 ease-in-out ${
          isMobile ? 'animate-slideDown' : ''
        }`}>
          <div className="p-3 space-y-1">
            <div className="space-y-1">
              {mainMenuItems.map((item) => (
                <MenuItem key={item.name} item={item} isCompact={!isMobile && isCollapsed} />
              ))}
            </div>

            <div className="mt-6">
              <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ${
                !isMobile && isCollapsed ? 'sr-only' : ''
              }`}>
                OBJECTIVES
              </h3>
              <div className="space-y-1">
                {objectivesMenuItems.map((item) => (
                  <MenuItem key={item.name} item={item} isCompact={!isMobile && isCollapsed} />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="space-y-1">
                {bottomMenuItems.map((item) => (
                  <MenuItem key={item.name} item={item} isCompact={!isMobile && isCollapsed} />
                ))}
              </div>
            </div>

            {/* 用戶菜單 */}
            <div className="mt-6">
              <div className="relative">
                <button
                  className={`flex items-center h-10 px-3 w-full rounded-lg transition-colors duration-200 text-gray-700 hover:bg-gray-100 ${
                    !isMobile && isCollapsed ? 'justify-center' : 'space-x-3'
                  }`}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  title={!isMobile && isCollapsed ? 'User Menu' : undefined}
                >
                  <span className="text-gray-600 flex items-center">
                    <UserIcon />
                  </span>
                  {(!isMobile || !isCollapsed) && (
                    <span className="truncate">
                      {user?.user_metadata?.display_name || 'User'}
                    </span>
                  )}
                </button>

                {/* 用戶下拉菜單 */}
                {showUserMenu && (
                  <div className={`absolute ${
                    !isMobile && isCollapsed ? 'left-full ml-2 -translate-y-full' : 'left-0 top-full mt-2'
                  } bg-white shadow-lg rounded-lg border border-gray-200 w-64 py-1 z-10`}>
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
          </div>
        </div>
      )}
    </aside>
  )
}

export default Sidebar
