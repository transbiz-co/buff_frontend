"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSearchParams, useRouter } from 'next/navigation'
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Plus, RefreshCw, Trash2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AddConnectionDialog } from "@/components/connections/add-connection-dialog"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { getAmazonAdsConnectionStatus, AmazonAdsProfile, deleteAmazonAdsConnection, updateAmazonAdsConnectionStatus } from "@/lib/api/connections"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import React from "react"
import SuccessModal from "@/components/SuccessModal"
import ErrorModal from "@/components/ErrorModal"

interface Connection {
  id: string
  profileId: string
  accountName: string
  accountType: string
  countryCode: string
  marketplaceId: string
  createdAt: string
  updatedAt: string
  isActive: boolean
  amazonAccountName?: string
  mainAccountName?: string
  mainAccountEmail?: string
}

export default function ConnectionsPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set())
  
  // Modal 相關狀態
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  
  // 使用 useRef 來跟踪 API 呼叫狀態
  const isLoadingRef = useRef(false)
  const initialLoadDoneRef = useRef(false)
  const currentAbortController = useRef<AbortController | null>(null)
  const statusParamCheckedRef = useRef(false)

  // 檢查 URL 參數（僅在組件掛載時執行一次）
  useEffect(() => {
    // 如果已經檢查過或者沒有 searchParams，則跳過
    if (statusParamCheckedRef.current || !searchParams || !user) return
    
    // 標記為已檢查，確保此邏輯只執行一次
    statusParamCheckedRef.current = true
    
    const status = searchParams.get('status')
    const message = searchParams.get('message')
    
    if (status === 'success') {
      // 設置成功 modal
      setModalMessage("Amazon Ads account connected successfully")
      setIsSuccessModalOpen(true)
      toast.success("Amazon Ads account connected successfully")
      
      // 清除 URL 中的參數
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', window.location.pathname)
      }
      
      // 延遲加載連接列表，給後端足夠時間處理
      setTimeout(() => {
        fetchConnections(true)
      }, 1500)
    } else if (status === 'error') {
      // 設置錯誤 modal
      const errorMsg = message || "Failed to connect to Amazon Ads. Please try again."
      setModalMessage(errorMsg)
      setIsErrorModalOpen(true)
      toast.error(errorMsg)
      
      // 清除 URL 中的參數
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', window.location.pathname)
      }
    }
  }, [searchParams, user]) // 依賴包含 searchParams 和 user，但由於使用 ref，實際上只會執行一次

  // 獲取連接列表，包含中止邏輯
  const fetchConnections = async (isManualRefresh = false) => {
    if (!user) return
    
    // 如果已經在載入中且不是手動重新整理，跳過
    if (isLoadingRef.current && !isManualRefresh) {
      console.log("正在載入中，跳過重複的請求")
      return
    }
    
    // 如果有上一個請求，中止它
    if (currentAbortController.current) {
      console.log("中止先前的請求")
      currentAbortController.current.abort()
    }
    
    // 建立新的 AbortController
    currentAbortController.current = new AbortController()
    const signal = currentAbortController.current.signal
    
    isLoadingRef.current = true
    setLoading(true)

    try {
      console.log(`正在獲取連接狀態，用戶ID: ${user.id}`)
      const result = await getAmazonAdsConnectionStatus(user.id, { signal })
      
      if (result.isConnected) {
        // 將 API 返回的數據格式轉換為我們需要的格式
        const formattedConnections = result.profiles.map((profile: AmazonAdsProfile) => ({
          id: profile.id,
          profileId: profile.profileId,
          accountName: profile.accountName,
          accountType: profile.accountType,
          countryCode: profile.countryCode,
          marketplaceId: profile.marketplaceId,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
          isActive: profile.isActive,
          amazonAccountName: profile.amazonAccountName,
          mainAccountName: profile.mainAccountName,
          mainAccountEmail: profile.mainAccountEmail,
        }))
        
        // 按照 accountName 字段進行字母順序排序
        formattedConnections.sort((a, b) => 
          a.accountName.toLowerCase().localeCompare(b.accountName.toLowerCase())
        )
        
        setConnections(formattedConnections)
        console.log(`成功載入 ${formattedConnections.length} 個連接`)
      } else {
        // 沒有連接時，顯示空列表
        setConnections([])
        console.log("未找到連接")
      }
    } catch (err: any) {
      // 忽略中止錯誤
      if (err.name === 'AbortError') {
        console.log("請求已被中止")
        return
      }
      
      console.error("獲取連接狀態失敗:", err)
      // 顯示錯誤modal
      setModalMessage("Failed to fetch connections. Please try again later.")
      setIsErrorModalOpen(true)
    } finally {
      isLoadingRef.current = false
      setLoading(false)
      initialLoadDoneRef.current = true
    }
  }

  // 防抖函數，確保短時間內不會重複觸發
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout
    return function(...args: any[]) {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func(...args)
      }, delay)
    }
  }

  // 使用防抖處理獲取連接列表
  const debouncedFetchConnections = useCallback(
    debounce((isManualRefresh: boolean) => {
      fetchConnections(isManualRefresh)
    }, 500),
    [user]
  )

  // 當用戶加載完成後，獲取連接狀態 (僅執行一次)
  useEffect(() => {
    if (user && !initialLoadDoneRef.current) {
      console.log("用戶載入完成，初始化連接列表")
      debouncedFetchConnections(false)
    }
    
    return () => {
      // 組件卸載時中止請求
      if (currentAbortController.current) {
        currentAbortController.current.abort()
      }
      
      // 重置檢查標記，以便下次掛載時能正確檢查
      statusParamCheckedRef.current = false
    }
  }, [user, debouncedFetchConnections])

  // 處理開關狀態變更
  const handleStatusChange = async (id: string, profileId: string, newStatus: boolean) => {
    try {
      // 設置臨時狀態，提供即時反饋
      setConnections(prev => prev.map(conn => 
        conn.id === id ? {...conn, isActive: newStatus} : conn
      ))
      
      // 實際調用 API 更新數據庫中的狀態
      const result = await updateAmazonAdsConnectionStatus(profileId, newStatus)
      
      if (result.success) {
        toast.success(`Connection ${newStatus ? "enabled" : "disabled"} successfully`)
      } else {
        // 如果API調用失敗，還原狀態
        setConnections(prev => prev.map(conn => 
          conn.id === id ? {...conn, isActive: !newStatus} : conn
        ))
        toast.error("Failed to update connection status. Please try again.")
      }
    } catch (error) {
      console.error("更新連接狀態失敗:", error)
      // 還原狀態
      setConnections(prev => prev.map(conn => 
        conn.id === id ? {...conn, isActive: !newStatus} : conn
      ))
      toast.error("Failed to update connection status. Please try again.")
    }
  }

  // 處理刪除連接
  const handleDeleteConnection = async (id: string, profileId: string, accountName: string) => {
    if (confirm(`Are you sure you want to delete the connection "${accountName}"?`)) {
      try {
        await deleteAmazonAdsConnection(profileId)
        // 刪除成功後，從列表中移除
        setConnections(prev => prev.filter(conn => conn.id !== id))
        toast.success(`Successfully deleted connection "${accountName}"`)
      } catch (err) {
        console.error("刪除連接失敗:", err)
        toast.error(`Unable to delete connection. Please try again later.`)
      }
    }
  }

  // 重新加載連接列表時使用防抖
  const handleRefresh = () => {
    console.log("手動觸發重新載入")
    debouncedFetchConnections(true) // 手動更新，使用防抖函數
  }

  // 處理同步數據（模擬功能）
  const handleSyncData = (id: string) => {
    setSyncingIds(prev => new Set(prev).add(id))

    // 模擬同步過程
    setTimeout(() => {
      setSyncingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
      toast.success("Data synced successfully")
    }, 2000)
  }

  // 添加連接成功後刷新列表
  const handleAddConnectionSuccess = () => {
    setIsAddDialogOpen(false)
    fetchConnections(true) // 手動更新，不檢查載入狀態
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // 處理關閉提示
  const handleDismissMessage = () => {
    setSuccessMessage(null)
    setError(null)
  }

  return (
    <div className="p-6 w-full">
      <div className="mb-6">
        <Breadcrumb segments={[{ name: "Connections" }]} />
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-2xl font-bold">Connections</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Connection
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground mt-2">
          Manage your Amazon advertising connections to enable data analysis and optimization
        </p>
      </div>

      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-medium">Profile</TableHead>
              <TableHead className="font-medium">Owner</TableHead>
              <TableHead className="font-medium">Marketplace</TableHead>
              <TableHead className="font-medium">Type</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Last Updated</TableHead>
              <TableHead className="font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <RefreshCw className="animate-spin h-6 w-6 mr-2" />
                    <span>Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : connections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No connections found. Click "Add Connection" to get started.
                </TableCell>
              </TableRow>
            ) : (
              connections.map((connection) => (
                <TableRow key={connection.id} className="group">
                  <TableCell className="font-medium">
                    <div>{connection.mainAccountName || connection.amazonAccountName || "Unknown Account"}</div>
                    <div className="text-xs text-muted-foreground">{connection.mainAccountEmail || ""}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{connection.accountName}</div>
                    <div className="text-xs text-muted-foreground">{connection.profileId}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{connection.countryCode}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      Amazon Ads
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={connection.isActive}
                      onCheckedChange={(checked) => handleStatusChange(connection.id, connection.profileId, checked)}
                    />
                  </TableCell>
                  <TableCell>{formatDate(connection.updatedAt)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSyncData(connection.id)}
                        disabled={syncingIds.has(connection.id) || !connection.isActive}
                        className="whitespace-nowrap"
                      >
                        <RefreshCw className={`mr-2 h-4 w-4 ${syncingIds.has(connection.id) ? "animate-spin" : ""}`} />
                        {syncingIds.has(connection.id) ? "Syncing..." : "Sync Data"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteConnection(connection.id, connection.profileId, connection.accountName)}
                        className="whitespace-nowrap text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AddConnectionDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddSuccess={handleAddConnectionSuccess}
        userId={user?.id}
      />
      
      {/* 成功連接 Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Connection Successful"
        message={modalMessage}
        buttonText="Got it"
        onButtonClick={() => setIsSuccessModalOpen(false)}
      />
      
      {/* 錯誤 Modal */}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title="Connection Error"
        message={modalMessage}
        buttonText="Try Again"
        onButtonClick={() => setIsErrorModalOpen(false)}
      />
    </div>
  )
}

