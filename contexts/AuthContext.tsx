"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  isPasswordRecovery: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  isPasswordRecovery: false
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // 檢查當前登入狀態
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        // 檢查是否存在密碼重置事件
        const lastAuthEvent = localStorage.getItem('supabase.auth.event')
        if (lastAuthEvent && lastAuthEvent.includes('PASSWORD_RECOVERY')) {
          console.log('AuthContext: Password recovery event detected in local storage')
          setIsPasswordRecovery(true)
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // 監聽登入狀態變化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null)
        
        // 處理密碼重設流程
        if (event === 'PASSWORD_RECOVERY') {
          // 保存事件到 localStorage 以便其他頁面可以檢測到
          localStorage.setItem('supabase.auth.event', event)
          setIsPasswordRecovery(true)
          
          // 檢查當前 URL 是否包含密碼重設相關參數
          const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
          const hasRecoveryParams = currentUrl.includes('type=recovery') || 
                                   currentUrl.includes('access_token=');
          
          // 只有當前頁面包含重設參數時才重定向
          if (hasRecoveryParams) {
            console.log('AuthContext: Redirecting to reset password page from recovery link')
            router.push('/reset-password');
          } else {
            console.log('AuthContext: PASSWORD_RECOVERY event detected but not redirecting (not from recovery link)')
          }
        }
        
        // 密碼更新成功後，清除密碼重置狀態
        if (event === 'USER_UPDATED') {
          // 移除標記
          localStorage.removeItem('supabase.auth.event')
          setIsPasswordRecovery(false)
        }

        // 如果其他原因需要設置 loading 狀態，可以在這裡處理
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
          setLoading(false)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const signOut = async () => {
    try {
      // 清除任何密碼重置狀態
      localStorage.removeItem('supabase.auth.event')
      setIsPasswordRecovery(false)
      
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, isPasswordRecovery }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 