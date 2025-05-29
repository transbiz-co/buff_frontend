import { 
  CampaignGroup, 
  CampaignGroupFormData, 
  CampaignGroupListResponse,
  CampaignAssignment 
} from '@/lib/campaign-group-types'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000'
const API_VERSION = '/api/v1'

class CampaignGroupsAPI {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = `${baseURL}${API_VERSION}/campaign-groups`
  }

  /**
   * Get all campaign groups for a user
   */
  async getGroups(userId: string, profileId?: string): Promise<CampaignGroupListResponse> {
    const params = new URLSearchParams({ user_id: userId })
    if (profileId) {
      params.append('profile_id', profileId)
    }
    
    const response = await fetch(`${this.baseURL}?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to fetch campaign groups: ${error}`)
    }

    return response.json()
  }

  /**
   * Get a specific campaign group by ID
   */
  async getGroup(groupId: string, userId: string): Promise<CampaignGroup> {
    const response = await fetch(
      `${this.baseURL}/${groupId}?user_id=${encodeURIComponent(userId)}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to fetch campaign group: ${error}`)
    }

    return response.json()
  }

  /**
   * Create a new campaign group
   */
  async createGroup(data: CampaignGroupFormData, userId: string): Promise<CampaignGroup> {
    const response = await fetch(
      `${this.baseURL}?user_id=${encodeURIComponent(userId)}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create campaign group: ${error}`)
    }

    return response.json()
  }

  /**
   * Update an existing campaign group
   */
  async updateGroup(
    groupId: string, 
    data: Partial<CampaignGroupFormData>, 
    userId: string
  ): Promise<CampaignGroup> {
    const response = await fetch(
      `${this.baseURL}/${groupId}?user_id=${encodeURIComponent(userId)}`,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to update campaign group: ${error}`)
    }

    return response.json()
  }

  /**
   * Delete a campaign group
   */
  async deleteGroup(groupId: string, userId: string): Promise<void> {
    const response = await fetch(
      `${this.baseURL}/${groupId}?user_id=${encodeURIComponent(userId)}`,
      {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        }
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to delete campaign group: ${error}`)
    }
  }

  /**
   * Assign campaigns to a group
   */
  async assignCampaigns(
    groupId: string, 
    campaignIds: string[], 
    userId: string
  ): Promise<void> {
    const response = await fetch(
      `${this.baseURL}/${groupId}/campaigns?user_id=${encodeURIComponent(userId)}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ campaign_ids: campaignIds })
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to assign campaigns: ${error}`)
    }
  }

  /**
   * Remove campaigns from a group
   */
  async removeCampaigns(
    groupId: string, 
    campaignIds: string[], 
    userId: string
  ): Promise<void> {
    const params = new URLSearchParams({
      user_id: userId,
      ...campaignIds.reduce((acc, id, index) => ({
        ...acc,
        [`campaign_ids[${index}]`]: id
      }), {})
    })

    // Since DELETE with query params for arrays can be tricky, 
    // we'll use URLSearchParams properly
    const queryString = `user_id=${encodeURIComponent(userId)}&${campaignIds.map(id => `campaign_ids=${encodeURIComponent(id)}`).join('&')}`

    const response = await fetch(
      `${this.baseURL}/${groupId}/campaigns?${queryString}`,
      {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        }
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to remove campaigns: ${error}`)
    }
  }

  /**
   * Get count of unassigned campaigns
   */
  async getUnassignedCampaignsCount(userId: string): Promise<number> {
    const response = await fetch(
      `${this.baseURL}/stats/unassigned-campaigns-count?user_id=${encodeURIComponent(userId)}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get unassigned campaigns count: ${error}`)
    }

    const data = await response.json()
    return data.count
  }
}

// Export singleton instance
export const campaignGroupsApi = new CampaignGroupsAPI(API_BASE_URL)