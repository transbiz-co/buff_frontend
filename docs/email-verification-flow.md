# 電子郵件存在性驗證流程

本文檔介紹了在忘記密碼流程中驗證電子郵件是否已在系統中註冊的實現方式。

## 功能概述

在用戶點擊「忘記密碼」並輸入電子郵件地址後，系統會先檢查該電子郵件是否已在 Supabase 中註冊。如果電子郵件不存在，則顯示錯誤訊息，而不是直接發送重置密碼郵件。這可以：

1. 提供更好的用戶體驗，立即告知用戶電子郵件可能輸入錯誤
2. 減少不必要的電子郵件發送
3. 引導未註冊用戶去創建新帳戶

## 技術實現

### 檢查電子郵件是否存在

我們使用 Supabase 的登入嘗試方法來檢查電子郵件是否存在：

```javascript
const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    // 使用 OTP 登入方法，但設置 shouldCreateUser 為 false
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false, // 不要創建新用戶
      }
    })

    // 分析錯誤訊息以確定電子郵件是否存在
    if (error && (
      error.message.includes('not found') || 
      error.message.includes('Invalid') ||
      error.message.includes('not exist')
    )) {
      return false
    }
    
    return true
  } catch (error) {
    console.error('檢查電子郵件時出錯:', error)
    // 出錯時返回 true 是一種安全策略
    return true
  }
}
```

### 處理忘記密碼流程

在忘記密碼的處理流程中，我們加入了電子郵件檢查步驟：

```javascript
// 處理忘記密碼流程
const handleForgotPassword = async (emailToReset?: string) => {
  const emailAddress = emailToReset || email
  
  if (!emailAddress) {
    setForgotPasswordError('請提供您的電子郵件地址')
    return
  }
  
  try {
    setIsLoading(true)
    setForgotPasswordError(null)
    
    // 檢查電子郵件是否存在
    const emailExists = await checkEmailExists(emailAddress)
    
    if (!emailExists) {
      setForgotPasswordError('此電子郵件地址尚未註冊。請檢查您的輸入或創建新帳戶。')
      return
    }
    
    // 如果電子郵件存在，繼續發送重置密碼郵件
    const { error } = await supabase.auth.resetPasswordForEmail(emailAddress, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    
    if (error) throw error
    
    // 顯示成功訊息
    setShowForgotPasswordModal(false)
    setShowResetSuccessModal(true)
  } catch (error) {
    // 處理錯誤
  }
}
```

### 界面整合

在用戶界面上，我們通過以下方式處理錯誤訊息：

1. 添加一個專門的 `forgotPasswordError` 狀態變量
2. 在 `ConfirmationModal` 組件中加入對錯誤訊息的處理
3. 在電子郵件不存在時，在模態框中顯示明確的錯誤訊息
4. 添加加載提示，在驗證電子郵件時顯示「驗證中...」

## 安全考慮

雖然從用戶體驗角度來看，提供電子郵件存在性的反饋是有用的，但這也可能被用於枚舉註冊用戶的電子郵件地址。在高安全性要求的應用中，您可能需要考慮：

1. **速率限制**：限制同一 IP 地址可以在特定時間內進行的電子郵件檢查次數
2. **CAPTCHA**：在多次嘗試後添加 CAPTCHA 驗證
3. **模糊錯誤訊息**：在某些情況下提供較為模糊的錯誤訊息，如「如果此電子郵件已註冊，我們將發送重置鏈接」

## 替代實現方法

除了使用 `signInWithOtp` 方法外，還有其他方式可以檢查電子郵件是否存在：

1. **使用 Admin API**：如果您有 Supabase 服務角色密鑰，可以使用管理員 API 直接查詢用戶，但這需要在後端進行。

2. **自定義 RPC 函數**：在 Supabase 中創建一個自定義 RPC 函數，安全地檢查電子郵件是否存在。

```sql
CREATE OR REPLACE FUNCTION check_email_exists(check_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE email = check_email
  ) INTO user_exists;
  
  RETURN user_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

這可以通過 `supabase.rpc('check_email_exists', { check_email: email })` 調用。

## 最佳實踐

1. **適當的錯誤處理**：確保所有可能的錯誤情況都有清晰的用戶反饋。

2. **防止濫用**：實施速率限制和其他防護措施，防止惡意用戶枚舉電子郵件地址。

3. **清晰的用戶引導**：在電子郵件不存在時，提供明確的下一步操作指導，如註冊鏈接。

4. **日誌記錄**：記錄異常的電子郵件檢查模式，以檢測潛在的濫用。

通過實施電子郵件存在性檢查，您可以提供更好的用戶體驗，同時減少系統資源的浪費和潛在的混淆。
