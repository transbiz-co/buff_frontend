import { supabase } from '@/lib/supabase'

/**
 * 驗證邀請碼是否有效
 * @param code 要驗證的邀請碼
 * @returns 如果邀請碼有效返回 true，否則返回 false
 */
export async function verifyInvitationCode(code: string): Promise<boolean> {
  try {
    // 方法 1: 使用 Supabase 函數 (推薦)
    const { data, error } = await supabase.rpc('verify_invitation_code', {
      code_param: code
    })
    
    if (error) {
      console.error('Error verifying invitation code:', error)
      
      // 回退到方法 2: 直接查詢資料表
      return fallbackVerification(code)
    }
    
    return !!data
  } catch (error) {
    console.error('Error in invitation code verification:', error)
    
    // 如果 RPC 調用失敗，回退到直接查詢
    return fallbackVerification(code)
  }
}

/**
 * 回退驗證方法，直接查詢資料表
 */
async function fallbackVerification(code: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('invitation_codes')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .eq('is_used', false)
      .single()

    if (error) {
      console.error('Error in fallback verification:', error)
      return false
    }

    // 檢查是否過期
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return false
    }

    return !!data
  } catch (error) {
    console.error('Error in fallback verification:', error)
    return false
  }
}

/**
 * 標記邀請碼已使用
 * @param code 邀請碼
 * @param userId 使用者 ID
 */
export async function markInvitationCodeAsUsed(code: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('invitation_codes')
      .update({
        is_used: true,
        used_by: userId,
        used_at: new Date().toISOString()
      })
      .eq('code', code)

    return !error
  } catch (error) {
    console.error('Error marking invitation code as used:', error)
    return false
  }
}
