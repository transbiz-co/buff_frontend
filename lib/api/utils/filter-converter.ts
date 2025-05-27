import { FilterCondition } from '@/components/filter-components/filter-types'

export function convertFiltersToAPI(filters: FilterCondition[]): Record<string, any> {
  const apiFilters: Record<string, any> = {}
  
  filters.forEach(filter => {
    switch (filter.column) {
      case 'campaign':
        if (filter.values.length > 0) {
          apiFilters.campaign = {
            operator: filter.operator,
            value: filter.values[0].value
          }
        }
        break
        
      case 'adType':
        if (filter.values.length > 0) {
          apiFilters.adType = filter.values.map(v => v.value)
        }
        break
        
      case 'state':
        if (filter.values.length > 0) {
          apiFilters.state = filter.values.map(v => v.value)
        }
        break
        
      // 數值型篩選
      case 'impressions':
      case 'clicks':
      case 'spend':
      case 'sales':
      case 'acos':
        if (filter.values.length > 0) {
          apiFilters[filter.column] = {
            operator: filter.operator,
            value: filter.values[0].value,
            ...(filter.operator === 'between' && {
              min: filter.values[0].value,
              max: filter.values[0].endValue
            })
          }
        }
        break
    }
  })
  
  return apiFilters
}