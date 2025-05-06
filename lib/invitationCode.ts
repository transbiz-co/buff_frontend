/**
 * 從環境變數中獲取允許的邀請碼列表
 * @returns 邀請碼陣列
 */
export function getAllowedInvitationCodes(): string[] {
  const codesString = process.env.NEXT_PUBLIC_INVITATION_CODES || '';
  return codesString.split(',').map(code => code.trim()).filter(Boolean);
}

/**
 * 驗證邀請碼是否有效
 * @param code 要驗證的邀請碼
 * @returns 如果邀請碼有效返回 true，否則返回 false
 */
export function verifyInvitationCode(code: string): boolean {
  if (!code) return false;
  
  const allowedCodes = getAllowedInvitationCodes();
  return allowedCodes.includes(code.trim());
} 