'use client'

import { useState, useEffect } from 'react'
import ConnectionModal from './ConnectionModal'

// 定義連接類型
interface Connection {
  id: string
  storeName: string
  type: string
  status: boolean
  marketplace: string
  lastUpdated: string
}

export default function ConnectionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [connections, setConnections] = useState<Connection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // 模擬從 API 獲取數據的效果
  useEffect(() => {
    // 在實際應用中，這裡會從後端 API 獲取數據
    const mockConnections: Connection[] = [
      {
        id: '1',
        storeName: 'Cool Gadgets',
        type: 'Amazon Sponsored Ads',
        status: true,
        marketplace: 'US',
        lastUpdated: 'Apr 5, 2025, 02:30 PM',
      },
      {
        id: '2',
        storeName: 'Happy Pets',
        type: 'Amazon Sponsored Ads',
        status: true,
        marketplace: 'US',
        lastUpdated: 'Apr 1, 2025, 08:45 AM',
      },
    ]
    
    // 模擬加載時間
    setTimeout(() => {
      setConnections(mockConnections)
      setIsLoading(false)
    }, 800)
  }, [])

  // 開啟模態框
  const openModal = () => {
    setIsModalOpen(true)
  }

  // 關閉模態框
  const closeModal = () => {
    setIsModalOpen(false)
  }

  // 處理添加新連接
  const handleAddConnection = (newConnection: Omit<Connection, 'id' | 'lastUpdated'>) => {
    // 在實際應用中，這裡會將新連接發送到後端 API
    const now = new Date()
    const formattedDate = `${now.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })}`
    
    const connection: Connection = {
      id: `${connections.length + 1}`,
      storeName: newConnection.storeName,
      type: newConnection.type,
      status: newConnection.status,
      marketplace: newConnection.marketplace,
      lastUpdated: formattedDate,
    }
    
    setConnections([...connections, connection])
    closeModal()
  }

  // 處理同步數據
  const handleSync = (id: string) => {
    // 在實際應用中，這裡會向後端 API 發送同步請求
    console.log(`Syncing data for connection ${id}`)
    
    // 更新最後同步時間
    const now = new Date()
    const formattedDate = `${now.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })}`
    
    setConnections(connections.map(conn => 
      conn.id === id ? { ...conn, lastUpdated: formattedDate } : conn
    ))
  }

  // 切換連接狀態
  const toggleStatus = (id: string) => {
    setConnections(connections.map(conn => 
      conn.id === id ? { ...conn, status: !conn.status } : conn
    ))
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Connections</h1>
          <p className="text-sm text-gray-600 mt-1 max-w-[300px] sm:max-w-none">
            Manage your connections to Amazon Sponsored Ads for the US marketplace
          </p>
        </div>
        <button
          onClick={openModal}
          className="mt-3 sm:mt-0 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md flex items-center self-start transition-colors duration-200 shadow-sm"
        >
          <span className="mr-1.5 sm:mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </span>
          Add Connection
        </button>
      </div>

      {/* 表格部分 - 桌面版和平板版 */}
      <div className="hidden sm:block table-container">
        <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          <table className="min-w-full table-fixed connection-table">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                <th className="w-1/5 px-4 md:px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Store Name
                </th>
                <th className="w-1/5 px-4 md:px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Type
                </th>
                <th className="w-1/6 px-4 md:px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="w-1/8 px-4 md:px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Marketplace
                </th>
                <th className="w-1/5 px-4 md:px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Last Updated
                </th>
                <th className="w-1/8 px-4 md:px-6 py-3 text-right text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 md:px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-red-500"></div>
                    </div>
                  </td>
                </tr>
              ) : connections.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 md:px-6 py-8 text-center text-gray-500">
                    No connections found. Click "Add Connection" to get started.
                  </td>
                </tr>
              ) : (
                connections.map((connection) => (
                  <tr key={connection.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 md:px-6 py-4 text-sm">
                      <div className="font-medium text-gray-800 truncate max-w-[120px] md:max-w-full">{connection.storeName}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-gray-700">
                      <div className="type-badge">
                        {connection.type}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm">
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={connection.status}
                          onChange={() => toggleStatus(connection.id)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-gray-700">
                      <div className="marketplace-badge">
                        {connection.marketplace}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-gray-700">
                      <div className="truncate">{connection.lastUpdated}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-right">
                      <button
                        onClick={() => handleSync(connection.id)}
                        className="sync-button"
                        disabled={!connection.status}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Sync Data</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* 表格部分 - 手機版卡片 */}
      <div className="sm:hidden space-y-3">
        {isLoading ? (
          <div className="py-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : connections.length === 0 ? (
          <div className="bg-white rounded-lg p-5 text-center text-gray-500 border border-gray-200 text-sm">
            No connections found. Click "Add Connection" to get started.
          </div>
        ) : (
          connections.map((connection) => (
            <div key={connection.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-3 py-2.5 border-b border-gray-200 flex justify-between items-center">
                <div className="font-medium text-gray-900 text-sm truncate max-w-[65%]">{connection.storeName}</div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={connection.status}
                    onChange={() => toggleStatus(connection.id)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="p-3 space-y-2">
                <div className="grid grid-cols-3">
                  <span className="text-xs text-gray-500">Type</span>
                  <span className="text-xs col-span-2 text-right">
                    <span className="type-badge">
                      {connection.type}
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-xs text-gray-500">Marketplace</span>
                  <span className="text-xs col-span-2 text-right">
                    <span className="marketplace-badge">
                      {connection.marketplace}
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-xs text-gray-500">Last Updated</span>
                  <span className="text-xs text-gray-900 col-span-2 text-right truncate">
                    {connection.lastUpdated}
                  </span>
                </div>
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => handleSync(connection.id)}
                    className="sync-button"
                    disabled={!connection.status}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Sync Data
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 連接模態框 */}
      <ConnectionModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onAddConnection={handleAddConnection} 
      />
    </div>
  )
}
