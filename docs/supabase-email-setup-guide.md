# Supabase 電子郵件設置指南

本指南將幫助您在 Supabase 項目中設置自定義電子郵件模板和發送設置。

## 步驟 1：訪問 Supabase 儀表板的電子郵件設置

1. 登錄到 [Supabase 儀表板](https://app.supabase.com)
2. 選擇您的項目
3. 在左側導航菜單中，點擊 **Authentication**
4. 選擇 **Email Templates** 選項卡

## 步驟 2：自定義確認電子郵件模板

1. 選擇 **Confirm Signup** 模板
2. 在電子郵件主題欄位中輸入：`請確認您的 Buff 帳戶電子郵件`
3. 將 `/docs/email-templates/confirmation-email.html` 中的內容複製到電子郵件內容編輯器中
4. 點擊 **Save**

## 步驟 3：自定義密碼重置電子郵件模板

1. 選擇 **Reset Password** 模板
2. 在電子郵件主題欄位中輸入：`重置您的 Buff 帳戶密碼`
3. 將 `/docs/email-templates/reset-password.html` 中的內容複製到電子郵件內容編輯器中
4. 點擊 **Save**

## 步驟 4：設置電子郵件發送設置

1. 點擊 **Email Settings** 選項卡
2. 更新以下設置：
   - **Sender Name**: `Buff 團隊`
   - **Sender Email**: 使用默認值 `noreply@[your-project-ref].supabase.co` 或設置您的自定義電子郵件

3. 如果您想使用自己的 SMTP 服務器（建議用於生產環境），點擊 **Custom SMTP** 並提供您的 SMTP 服務器詳細信息：
   - SMTP Host (例如 `smtp.sendgrid.net`)
   - SMTP Port (通常是 587 或 465)
   - SMTP Username
   - SMTP Password
   - 發件人電子郵件 (例如 `noreply@your-domain.com`)

4. 點擊 **Save**

## 步驟 5：測試電子郵件設置

1. 返回 **Email Templates** 選項卡
2. 選擇您想要測試的模板
3. 點擊 **Send test email**
4. 輸入您的電子郵件地址
5. 點擊 **Send test email**
6. 檢查您的收件箱，確認樣式和格式正確

## 步驟 6：配置電子郵件交付選項

1. 在左側導航菜單中，點擊 **Authentication**
2. 選擇 **Providers** 選項卡
3. 在 **Email** 部分，點擊 **Settings**
4. 配置以下選項：
   - **確認電子郵件**: 設置為 `必需` (預設)
   - **安全電子郵件更改**: 設置為 `啟用` (預設)
   - **為新登錄設備發送電子郵件**: 根據您的安全需求設置

5. 點擊 **Save**

## 故障排除提示

如果您的測試電子郵件未能到達您的收件箱：

1. 檢查您的垃圾郵件/垃圾文件夾
2. 確認您的電子郵件地址輸入正確
3. 確認 SMTP 設置是否正確 (如果您使用自定義 SMTP)
4. 檢查 Supabase 儀表板中的 **Logs** 部分，查找任何郵件發送失敗的日誌

## 生產環境建議

對於生產環境，強烈建議：

1. 設置您自己的 SMTP 服務器或使用可靠的電子郵件服務如 SendGrid、Mailgun 或 Amazon SES
2. 設置 SPF 和 DKIM 記錄以提高送達率和防止您的電子郵件進入垃圾郵件文件夾
3. 注冊一個專用域名（或子域名）用於發送交易電子郵件
4. 定期監控您的電子郵件送達率和退回率

通過遵循這些步驟，您將確保您的用戶獲得專業外觀的電子郵件通知，這將提高您應用的可信度和用戶體驗。
