'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
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
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Connections</h1>
          <p className="text-gray-600 mt-1">
            Manage your connections to Amazon Sponsored Ads for the US marketplace
          </p>
        </div>
        <button
          onClick={openModal}
          className="mt-4 md:mt-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center"
        >
          <span className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </span>
          Add Connection
        </button>
      </div>

      {/* 表格部分 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Store Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marketplace
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-red-500"></div>
                    </div>
                  </td>
                </tr>
              ) : connections.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No connections found. Click "Add Connection" to get started.
                  </td>
                </tr>
              ) : (
                connections.map((connection) => (
                  <tr key={connection.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{connection.storeName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {connection.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleStatus(connection.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          connection.status
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {connection.status ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {connection.marketplace}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {connection.lastUpdated}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleSync(connection.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Sync Data
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
      <div className="md:hidden space-y-4">
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : connections.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-center text-gray-500 shadow">
            No connections found. Click "Add Connection" to get started.
          </div>
        ) : (
          connections.map((connection) => (
            <div key={connection.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <div className="font-medium text-gray-900">{connection.storeName}</div>
                <button
                  onClick={() => toggleStatus(connection.id)}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    connection.status
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {connection.status ? 'Active' : 'Inactive'}
                </button>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Type</span>
                  <span className="text-sm text-gray-900">{connection.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Marketplace</span>
                  <span className="text-sm text-gray-900">{connection.marketplace}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Last Updated</span>
                  <span className="text-sm text-gray-900">{connection.lastUpdated}</span>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => handleSync(connection.id)}
                    className="w-full py-2 px-3 flex items-center justify-center border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
