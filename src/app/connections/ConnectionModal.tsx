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
            <div className="mb-3 sm:mb-4">
              <p className="text-sm sm:text-base text-gray-700 mb-1 sm:mb-2">
                Connect your Amazon Sponsored Ads account to optimize your campaigns.
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                We'll need your store name and marketplace to identify your connection.
              </p>
            </div>
            
            {/* 商店名稱 */}
            <div>
              <label htmlFor="storeName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
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
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                This name will identify your connection in the dashboard
              </p>
            </div>
            
            {/* 連接類型 - 預設為唯讀，由於目前只支援 Amazon Sponsored Ads */}
            <div>
              <label htmlFor="connectionType" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Connection Type
              </label>
              <input
                type="text"
                id="connectionType"
                value="Amazon Sponsored Ads"
                disabled
                className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm cursor-not-allowed text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Currently only Amazon Sponsored Ads is supported
              </p>
            </div>
            
            {/* 市場選擇 */}
            <div>
              <label htmlFor="marketplace" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Marketplace <span className="text-red-500">*</span>
              </label>
              <select
                id="marketplace"
                value={marketplace}
                onChange={(e) => setMarketplace(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 text-sm"
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
          <div className={`flex justify-center mt-5 sm:mt-6 transition-all duration-300 ${
            animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ transitionDelay: '0.2s' }}>
            <button
              type="button"
              onClick={handleConnectWithAmazon}
              disabled={isLoading}
              className="w-full py-2 sm:py-2.5 font-medium sm:font-semibold bg-amber-500 hover:bg-amber-600 text-black rounded-md transition-all duration-200 hover:shadow-md flex items-center justify-center text-sm"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </span>
              ) : (
                <>
                  <svg className="h-4 w-5 sm:h-5 sm:w-6 mr-1.5 sm:mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35.418 35.418" fill="currentColor">
                    <g>
                      <path d="M20.948,9.891c-0.857,0.068-1.847,0.136-2.837,0.269c-1.516,0.195-3.032,0.461-4.284,1.053
                        c-2.439,0.994-4.088,3.105-4.088,6.209c0,3.898,2.506,5.875,5.669,5.875c1.057,0,1.913-0.129,2.703-0.328
                        c1.255-0.396,2.31-1.123,3.562-2.441c0.727,0.99,0.923,1.453,2.177,2.509c0.329,0.133,0.658,0.133,0.922-0.066
                        c0.791-0.659,2.174-1.848,2.901-2.508c0.328-0.267,0.263-0.66,0.066-0.992c-0.727-0.924-1.45-1.718-1.45-3.498v-5.943
                        c0-2.513,0.195-4.822-1.647-6.537c-1.518-1.391-3.891-1.916-5.735-1.916c-0.264,0-0.527,0-0.792,0
                        c-3.362,0.197-6.921,1.647-7.714,5.811c-0.13,0.525,0.267,0.726,0.53,0.793l3.691,0.464c0.396-0.07,0.593-0.398,0.658-0.73
                        c0.333-1.449,1.518-2.176,2.836-2.309c0.067,0,0.133,0,0.265,0c0.79,0,1.646,0.332,2.109,0.987
                        c0.523,0.795,0.461,1.853,0.461,2.775L20.948,9.891L20.948,9.891z M20.223,17.749c-0.461,0.925-1.253,1.519-2.11,1.718
                        c-0.131,0-0.327,0.068-0.526,0.068c-1.45,0-2.31-1.123-2.31-2.775c0-2.11,1.254-3.104,2.836-3.565
                        c0.857-0.197,1.847-0.265,2.836-0.265v0.793C20.948,15.243,21.01,16.43,20.223,17.749z M35.418,26.918v0.215
                        c-0.035,1.291-0.716,3.768-2.328,5.131c-0.322,0.25-0.645,0.107-0.503-0.254c0.469-1.145,1.541-3.803,1.04-4.412
                        c-0.355-0.465-1.826-0.43-3.079-0.322c-0.572,0.072-1.075,0.105-1.469,0.183c-0.357,0.033-0.431-0.287-0.071-0.537
                        c0.466-0.323,0.969-0.573,1.541-0.756c2.039-0.608,4.406-0.25,4.729,0.146C35.348,26.414,35.418,26.629,35.418,26.918z
                        M32.016,29.428c-0.466,0.357-0.965,0.682-1.468,0.973c-3.761,2.261-8.631,3.441-12.856,3.441c-6.807,0-12.895-2.512-17.514-6.709
                        c-0.396-0.324-0.073-0.789,0.393-0.539C5.549,29.5,11.709,31.26,18.084,31.26c4.013,0,8.342-0.754,12.463-2.371
                        c0.285-0.104,0.608-0.252,0.895-0.356C32.087,28.242,32.661,28.965,32.016,29.428z"/>
                    </g>
                  </svg>
                  Connect with Amazon
                </>
              )}
            </button>
          </div>
          
          {/* 說明文字 */}
          <div className={`text-center text-xs text-gray-500 mt-3 transition-all duration-300 ${
            animateIn ? 'opacity-100' : 'opacity-0'
          }`} style={{ transitionDelay: '0.3s' }}>
            <p>
              By connecting, you authorize TransBiz to access your ad data.
            </p>
          </div>
        </form>
      </div>
    </Modal>
  )
}
