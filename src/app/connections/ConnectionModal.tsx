'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'

interface ConnectionModalProps {
  isOpen: boolean
  onClose: () => void
  onAddConnection: (connection: {
    storeName: string
    type: string
    status: boolean
    marketplace: string
  }) => void
}

// Amazon 市場選項
const marketplaces = [
  { id: 'us', name: 'United States (US)' },
  { id: 'ca', name: 'Canada (CA)' },
  { id: 'mx', name: 'Mexico (MX)' },
  { id: 'uk', name: 'United Kingdom (UK)' },
  { id: 'de', name: 'Germany (DE)' },
  { id: 'fr', name: 'France (FR)' },
  { id: 'it', name: 'Italy (IT)' },
  { id: 'es', name: 'Spain (ES)' },
  { id: 'jp', name: 'Japan (JP)' },
  { id: 'au', name: 'Australia (AU)' },
]

export default function ConnectionModal({
  isOpen,
  onClose,
  onAddConnection,
}: ConnectionModalProps) {
  // 表單狀態
  const [storeName, setStoreName] = useState('')
  const [marketplace, setMarketplace] = useState('us')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [animateIn, setAnimateIn] = useState(false)

  // 重置表單
  const resetForm = () => {
    setStoreName('')
    setMarketplace('us')
    setError(null)
  }

  // 清理和動畫效果
  useEffect(() => {
    if (isOpen) {
      resetForm()
      // 延遲啟動內容動畫
      const timer = setTimeout(() => {
        setAnimateIn(true)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setAnimateIn(false)
    }
  }, [isOpen])

  // 處理提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 表單驗證
    if (!storeName.trim()) {
      setError('Store name is required')
      return
    }
    
    setIsLoading(true)
    
    // 模擬與 Amazon 的連接過程
    setTimeout(() => {
      onAddConnection({
        storeName: storeName.trim(),
        type: 'Amazon Sponsored Ads',
        status: true,
        marketplace: marketplaces.find(m => m.id === marketplace)?.id.toUpperCase() || 'US',
      })
      
      setIsLoading(false)
      resetForm()
    }, 1000)
  }

  // 處理 Amazon 連接
  const handleConnectWithAmazon = () => {
    // 在這裡處理與 Amazon 的連接流程
    // 這部分將在後續實現，現在僅顯示模擬行為
    
    if (!storeName.trim()) {
      setError('Please enter a store name before connecting')
      return
    }
    
    setIsLoading(true)
    
    // 模擬連接過程
    setTimeout(() => {
      // 連接成功後
      onAddConnection({
        storeName: storeName.trim(),
        type: 'Amazon Sponsored Ads',
        status: true,
        marketplace: marketplaces.find(m => m.id === marketplace)?.id.toUpperCase() || 'US',
      })
      
      setIsLoading(false)
      resetForm()
    }, 1500)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Amazon Connection">
      <div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 表單內容區塊 */}
          <div className={`space-y-4 transition-all duration-300 ${
            animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            {/* 說明文字 */}
            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                Connect your Amazon Sponsored Ads account to optimize your campaigns and analyze performance.
              </p>
              <p className="text-gray-500 text-sm">
                We'll need your store name and marketplace to identify your connection.
              </p>
            </div>
            
            {/* 商店名稱 */}
            <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
                Store Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="storeName"
                value={storeName}
                onChange={(e) => {
                  setStoreName(e.target.value)
                  setError(null)
                }}
                placeholder="Enter a name for this connection"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
              />
              <p className="mt-1 text-xs text-gray-500">
                This name will be used to identify your connection in the dashboard
              </p>
            </div>
            
            {/* 連接類型 - 預設為唯讀，由於目前只支援 Amazon Sponsored Ads */}
            <div>
              <label htmlFor="connectionType" className="block text-sm font-medium text-gray-700 mb-1">
                Connection Type
              </label>
              <input
                type="text"
                id="connectionType"
                value="Amazon Sponsored Ads"
                disabled
                className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">
                Currently only Amazon Sponsored Ads is supported
              </p>
            </div>
            
            {/* 市場選擇 */}
            <div>
              <label htmlFor="marketplace" className="block text-sm font-medium text-gray-700 mb-1">
                Marketplace <span className="text-red-500">*</span>
              </label>
              <select
                id="marketplace"
                value={marketplace}
                onChange={(e) => setMarketplace(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
              >
                {marketplaces.map((market) => (
                  <option key={market.id} value={market.id}>
                    {market.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* 錯誤訊息 */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                {error}
              </div>
            )}
          </div>
          
          {/* 按鈕區塊 */}
          <div className={`flex justify-center mt-6 transition-all duration-300 ${
            animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ transitionDelay: '0.2s' }}>
            <button
              type="button"
              onClick={handleConnectWithAmazon}
              disabled={isLoading}
              className="w-full py-2.5 font-semibold bg-amber-500 hover:bg-amber-600 text-black rounded-md transition-all duration-200 hover:shadow-md flex items-center justify-center"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </span>
              ) : (
                <>
                  <svg className="h-5 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                    <path d="M24.0005 10C15.1782 10 8 12.6176 8 18C8 23.3824 15.1782 26 24.0005 26C32.8218 26 40 23.3824 40 18C40 12.6176 32.8218 10 24.0005 10ZM10.4365 28.6247C9.86891 28.398 9.28767 28.1489 8.7168 27.872C7.98184 27.5209 7.28538 27.1161 6.64041 26.6606C5.85026 26.1219 5.42877 25.8297 5.42877 24.9139V22.0759C5.42877 21.9375 5.56219 21.8767 5.6762 21.9598C8.75572 24.0387 13.1187 25.2246 17.9529 25.4908C19.3329 25.5679 20.7256 25.5856 22.1178 25.5333C24.5246 25.4458 26.9178 25.1417 29.239 24.6267C29.6748 24.5326 30.1081 24.4322 30.5381 24.326C31.0152 24.2101 31.3715 24.1299 31.3715 24.1299C31.3715 24.1299 30.9611 24.2962 30.3709 24.5267C27.9601 25.4103 22.5466 26.95 16.43 26.428C13.1824 26.1567 10.4365 28.6247 10.4365 28.6247ZM36.8657 20.1753C34.3782 20.1753 33.5468 18.5753 33.5468 18.5753C33.5468 18.5753 32.7153 20.1753 30.2276 20.1753C27.4044 20.1753 26.1338 18.5753 26.1338 18.5753C26.1338 18.5753 25.1962 20.1753 22.6038 20.1753C19.5364 20.1753 18.5987 18.5753 18.5987 18.5753C18.5987 18.5753 17.348 20.1753 14.5249 20.1753C11.9324 20.1753 10.9948 18.5753 10.9948 18.5753C10.9948 18.5753 9.72397 20.1753 6.90086 20.1753C6.90086 20.1753 6.27627 20.1753 5.65131 19.9753L5.64845 26.6619C5.64831 26.6771 5.65103 26.6922 5.65654 26.7065C5.66204 26.7208 5.67023 26.7342 5.68072 26.7459C8.73001 28.9328 16.0236 30.1752 24.0005 30.1752C31.9765 30.1752 39.2701 28.9328 42.3203 26.7459C42.3308 26.7342 42.339 26.7208 42.3445 26.7065C42.35 26.6922 42.3527 26.6771 42.3526 26.6619V19.2953C41.8409 19.8753 41.0095 20.1753 40.0719 20.1753C37.4795 20.1753 36.8657 20.1753 36.8657 20.1753ZM35.4223 30.75C28.5678 31.95 19.4332 31.95 12.5787 30.75C9.14998 30.15 7.74998 35.25 10.5787 36.45C18.0678 39.15 29.9332 39.15 37.4223 36.45C40.2519 35.25 38.8519 30.15 35.4223 30.75Z" fill="currentColor"/>
                  </svg>
                  Connect with Amazon
                </>
              )}
            </button>
          </div>
          
          {/* 說明文字 */}
          <div className={`text-center text-xs text-gray-500 transition-all duration-300 ${
            animateIn ? 'opacity-100' : 'opacity-0'
          }`} style={{ transitionDelay: '0.3s' }}>
            <p>
              By connecting your Amazon account, you authorize TransBiz to access and manage your advertising data.
            </p>
          </div>
        </form>
      </div>
    </Modal>
  )
}
