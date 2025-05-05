// Define the column types and their operators
export const COLUMN_TYPES = {
  TEXT: "text",
  ENUM: "enum",
  DATE: "date",
  NUMBER: "number",
  PERCENTAGE: "percentage",
}

// Define the operators for each column type
export const OPERATORS = {
  [COLUMN_TYPES.TEXT]: [
    { value: "contains", label: "Contains" },
    { value: "not_contains", label: "Doesn't contain" },
    { value: "equals", label: "Equals" },
    { value: "not_equals", label: "Doesn't equal" },
    { value: "starts_with", label: "Starts with" },
    { value: "ends_with", label: "Ends with" },
  ],
  [COLUMN_TYPES.DATE]: [
    { value: "between", label: "Between" },
    { value: "before", label: "Before" },
    { value: "after", label: "After" },
    { value: "equals", label: "Is" },
    { value: "never", label: "Never" },
  ],
  [COLUMN_TYPES.NUMBER]: [
    { value: "less_than", label: "Less than" },
    { value: "less_than_equal", label: "Less than or equal" },
    { value: "equals", label: "Equal to" },
    { value: "not_equals", label: "Not equal to" },
    { value: "greater_than_equal", label: "Greater than or equal" },
    { value: "greater_than", label: "Greater than" },
    { value: "between", label: "Between" },
  ],
  [COLUMN_TYPES.PERCENTAGE]: [
    { value: "less_than", label: "Less than" },
    { value: "less_than_equal", label: "Less than or equal" },
    { value: "equals", label: "Equal to" },
    { value: "not_equals", label: "Not equal to" },
    { value: "greater_than_equal", label: "Greater than or equal" },
    { value: "greater_than", label: "Greater than" },
    { value: "between", label: "Between" },
  ],
}

// Define the available columns for filtering
export const FILTER_COLUMNS = [
  {
    id: "campaign",
    label: "Campaign Name",
    type: COLUMN_TYPES.TEXT,
    defaultOperators: ["contains", "not_contains", "equals"],
    defaultLogicalOperator: "OR",
  },
  {
    id: "adType",
    label: "Ad Type",
    type: COLUMN_TYPES.ENUM,
    options: [
      { value: "SP", label: "Sponsored Products" },
      { value: "SB", label: "Sponsored Brands" },
      { value: "SD", label: "Sponsored Display" },
      { value: "ST", label: "Sponsored TV" },
    ],
  },
  {
    id: "state",
    label: "State",
    type: COLUMN_TYPES.ENUM,
    options: [
      { value: "active", label: "Active" },
      { value: "paused", label: "Paused" },
      { value: "archived", label: "Archived" },
    ],
  },
  { id: "startDate", label: "Start Date", type: COLUMN_TYPES.DATE },
  { id: "impressions", label: "Impressions", type: COLUMN_TYPES.NUMBER },
  { id: "clicks", label: "Clicks", type: COLUMN_TYPES.NUMBER },
  { id: "orders", label: "Orders", type: COLUMN_TYPES.NUMBER },
  { id: "units", label: "Units", type: COLUMN_TYPES.NUMBER },
  { id: "ctr", label: "CTR", type: COLUMN_TYPES.PERCENTAGE },
  { id: "cvr", label: "CVR", type: COLUMN_TYPES.PERCENTAGE },
  { id: "cpc", label: "CPC", type: COLUMN_TYPES.NUMBER },
  { id: "spend", label: "Spend", type: COLUMN_TYPES.NUMBER },
  { id: "sales", label: "Sales", type: COLUMN_TYPES.NUMBER },
  { id: "acos", label: "ACOS", type: COLUMN_TYPES.PERCENTAGE },
]

// Define the filter value type
export interface FilterValue {
  id: string
  value: any
  endValue?: any // For "between" operators
}

// Define the filter condition type
export interface FilterCondition {
  id: string
  column: string
  columnType: string
  operator: string
  values: FilterValue[]
  valuesLogicalOperator: "AND" | "OR"
}
