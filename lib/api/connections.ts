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
  marketplaceName?: string;
  amazonAccountName: string;
  isActive: boolean;
  region?: string;
  timezone?: string;
  createdAt: string;
  updatedAt: string;
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
        marketplaceName: profile.marketplace_name,
        amazonAccountName: profile.amazon_account_name || profile.account_name,
        isActive: profile.is_active !== undefined ? profile.is_active : true,
        region: profile.region,
        timezone: profile.timezone,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
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