import { createClient } from '@supabase/supabase-js'

// 從環境變量獲取 Supabase URL 和匿名密鑰
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 確保環境變量存在
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('缺少 Supabase 環境變量。請確保設置了 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// 創建 Supabase 客戶端
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 對外暴露的身份驗證函數
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

// 登出函數
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// 獲取當前用戶會話
export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

// 獲取當前用戶
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
} 