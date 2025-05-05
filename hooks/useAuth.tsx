"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, getCurrentUser } from '@/lib/supabase'

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  error: Error | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  error: null
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // 初始化時獲取用戶信息
    async function initializeAuth() {
      try {
        setIsLoading(true)
        // 獲取當前會話
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        setSession(currentSession)
        
        if (currentSession) {
          const currentUser = await getCurrentUser()
          setUser(currentUser)
        }
      } catch (err) {
        console.error('身份驗證初始化錯誤:', err)
        setError(err instanceof Error ? err : new Error('身份驗證初始化失敗'))
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // 訂閱身份驗證狀態變化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession)
        
        if (newSession) {
          try {
            const newUser = await getCurrentUser()
            setUser(newUser)
          } catch (err) {
            console.error('獲取用戶資料錯誤:', err)
          }
        } else {
          setUser(null)
        }
        
        setIsLoading(false)
      }
    )

    // 清理訂閱
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, session, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 