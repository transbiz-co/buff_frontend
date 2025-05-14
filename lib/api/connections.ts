// API 服務文件 - 實現 Amazon Ads 連接相關 API 調用

// 定義連接類型介面
export interface AmazonAdsProfile {
  id: string;
  profileId: string;
  accountName: string;
  accountType: string;
  countryCode: string;
  currencyCode: string;
  marketplaceId: string;
  amazonAccountName: string;
  isActive: boolean;
  timezone?: string;
  createdAt: string;
  updatedAt: string;
  mainAccountId?: number;
  mainAccountName?: string;
  mainAccountEmail?: string;
}

export interface AmazonAdsConnectionStatus {
  isConnected: boolean;
  profiles: AmazonAdsProfile[];
}

/**
 * 獲取用戶的 Amazon Ads 連接狀態
 * @param userId 用戶 ID
 * @param options 請求選項，包含 AbortController signal
 * @returns 連接狀態及配置檔案列表
 */
export async function getAmazonAdsConnectionStatus(
  userId: string, 
  options?: { signal?: AbortSignal }
): Promise<AmazonAdsConnectionStatus> {
  try {
    // 環境變數中的 API URL，或者在開發環境中使用本地地址
    const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiBaseUrl}/api/v1/connections/amazon-ads/status?user_id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: options?.signal, // 添加 signal 參數支持
    });

    if (!response.ok) {
      throw new Error(`API 請求失敗: ${response.status}`);
    }

    const data = await response.json();
    
    // 將後端 API 的回應格式轉換為前端期望的格式
    return {
      isConnected: data.connected,
      profiles: data.profiles.map((profile: any) => ({
        id: profile.id || profile.profile_id, // 確保有 id，如果沒有則使用 profile_id
        profileId: profile.profile_id,
        accountName: profile.account_name,
        accountType: profile.account_type,
        countryCode: profile.country_code,
        currencyCode: profile.currency_code,
        marketplaceId: profile.marketplace_id,
        amazonAccountName: profile.amazon_account_name || profile.account_name,
        isActive: profile.is_active !== undefined ? profile.is_active : true,
        timezone: profile.timezone,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
        mainAccountId: profile.main_account_id,
        mainAccountName: profile.main_account_name,
        mainAccountEmail: profile.main_account_email
      }))
    };
  } catch (error) {
    console.error('獲取 Amazon Ads 連接狀態錯誤:', error);
    throw error;
  }
}

/**
 * 獲取 Amazon Ads 授權 URL
 * @param userId 用戶 ID
 * @returns 包含授權 URL 的物件
 */
export async function getAmazonAdsAuthorizeUrl(userId: string): Promise<{ authorizeUrl: string }> {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiBaseUrl}/api/v1/connections/amazon-ads/authorize?user_id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API 請求失敗: ${response.status}`);
    }

    const data = await response.json();
    
    // 根據後端 API 的回應格式返回授權 URL
    return {
      authorizeUrl: data.auth_url
    };
  } catch (error) {
    console.error('獲取 Amazon Ads 授權 URL 錯誤:', error);
    throw error;
  }
}

/**
 * 刪除 Amazon Ads 連接
 * @param profileId Amazon Ads 配置檔案 ID
 * @returns 操作結果
 */
export async function deleteAmazonAdsConnection(profileId: string): Promise<{ success: boolean }> {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiBaseUrl}/api/v1/connections/amazon-ads/${profileId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API 請求失敗: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: data.status === 'success'
    };
  } catch (error) {
    console.error('刪除 Amazon Ads 連接錯誤:', error);
    throw error;
  }
}

/**
 * 更新 Amazon Ads 連接狀態
 * @param profileId Amazon Ads 配置檔案 ID
 * @param isActive 是否啟用連接
 * @returns 操作結果
 */
export async function updateAmazonAdsConnectionStatus(
  profileId: string, 
  isActive: boolean
): Promise<{ success: boolean }> {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiBaseUrl}/api/v1/connections/amazon-ads/${profileId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_active: isActive }),
    });

    if (!response.ok) {
      throw new Error(`API 請求失敗: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: data.status === 'success'
    };
  } catch (error) {
    console.error('更新 Amazon Ads 連接狀態錯誤:', error);
    throw error;
  }
}

/**
 * 刷新 Amazon Ads 連接的訪問令牌
 * @param profileId Amazon Ads 配置檔案 ID
 * @returns 操作結果，包含新的訪問令牌
 */
export async function refreshAmazonAdsToken(
  profileId: string
): Promise<{ success: boolean; access_token?: string; }> {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000';
    // 查看後端路由定義，參數是通過 Query 參數傳遞，而非 JSON body
    const response = await fetch(`${apiBaseUrl}/api/v1/connections/amazon-ads/refresh-token?profile_id=${profileId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`API 請求失敗: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      access_token: data.access_token
    };
  } catch (error) {
    console.error('刷新 Amazon Ads 訪問令牌錯誤:', error);
    throw error;
  }
}

/**
 * 批量刷新用戶所有 Amazon Ads 連接的訪問令牌
 * @param userId 用戶 ID
 * @returns 操作結果，包含刷新詳情
 */
export async function bulkRefreshAmazonAdsTokens(
  userId: string
): Promise<{
  success: boolean;
  message: string;
  total: number;
  refreshed: number;
  failed: number;
  failed_details?: Array<{ profile_id: string; error: string }>;
}> {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiBaseUrl}/api/v1/connections/amazon-ads/bulk-refresh-tokens?user_id=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`API 請求失敗: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('批量刷新 Amazon Ads 訪問令牌錯誤:', error);
    throw error;
  }
} 