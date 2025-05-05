// Mock campaign data based on the provided CSV file
// Date range: 03/07/2025 - 04/05/2025

export interface Campaign {
  id: string
  adType: string
  campaign: string
  state: string
  optGroup: string
  lastOptimized: string
  impressions: number
  clicks: number
  orders: number
  units: number
  ctr: number
  cvr: number
  cpc: number
  spend: number
  spendTrend: number
  sales: number
  salesTrend: number
  acos: number
  acosTrend: number
  rpc: number
  trend: {
    sales: number[]
    spend: number[]
  }
  date: string
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

// Helper function to generate random trend data
function generateTrendData(min: number, max: number, length = 30): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min)
}

// Generate mock campaign data
export const mockCampaigns: Campaign[] = [
  {
    id: "camp1",
    adType: "SP",
    campaign: "VC5006-MWD-PGR-134 - SPA - Auto 1 Close Match - Y",
    state: "ENABLED",
    optGroup: "Discovery",
    lastOptimized: "2025-03-28T07:55:01.598203Z",
    impressions: 142384,
    clicks: 3502,
    orders: 222,
    units: 393,
    ctr: 2.5,
    cvr: 6.3,
    cpc: 0.57,
    spend: 2004.0,
    spendTrend: -1.1,
    sales: 8797.0,
    salesTrend: 4.0,
    acos: 22.8,
    acosTrend: -5.2,
    rpc: 2.51,
    trend: {
      sales: [
        8200, 8350, 8500, 8600, 8450, 8500, 8650, 8700, 8750, 8800, 8850, 8900, 8950, 9000, 8950, 8900, 8850, 8800,
        8750, 8700, 8650, 8600, 8550, 8500, 8450, 8400, 8500, 8600, 8700, 8797,
      ],
      spend: [
        2100, 2080, 2060, 2040, 2020, 2000, 1980, 1960, 1940, 1920, 1900, 1920, 1940, 1960, 1980, 2000, 2020, 2040,
        2060, 2080, 2100, 2080, 2060, 2040, 2020, 2000, 1980, 1960, 1940, 2004,
      ],
    },
    date: "2025-03-07",
  },
  {
    id: "camp2",
    adType: "SP",
    campaign: "VC5000-MWD-WM-134 - SPA - Auto 2 Substitutes - Y",
    state: "ENABLED",
    optGroup: "Breakeven",
    lastOptimized: "2025-03-15T14:30:22.123456Z",
    impressions: 141769,
    clicks: 1871,
    orders: 128,
    units: 193,
    ctr: 1.3,
    cvr: 6.8,
    cpc: 0.81,
    spend: 1521.0,
    spendTrend: -3.8,
    sales: 11826.0,
    salesTrend: -4.2,
    acos: 12.9,
    acosTrend: -0.4,
    rpc: 6.32,
    trend: {
      sales: [
        12500, 12400, 12300, 12200, 12100, 12000, 11900, 11800, 11700, 11600, 11500, 11600, 11700, 11800, 11900, 12000,
        12100, 12200, 12100, 12000, 11900, 11800, 11700, 11600, 11700, 11800, 11900, 12000, 11900, 11826,
      ],
      spend: [
        1600, 1590, 1580, 1570, 1560, 1550, 1540, 1530, 1520, 1510, 1500, 1510, 1520, 1530, 1540, 1550, 1560, 1570,
        1560, 1550, 1540, 1530, 1520, 1510, 1520, 1530, 1540, 1550, 1530, 1521,
      ],
    },
    date: "2025-03-10",
  },
  {
    id: "camp3",
    adType: "SP",
    campaign: "VC5002-MWD-PGR-134 - SPA - Auto 3 Complements - Y",
    state: "ENABLED",
    optGroup: "Breakeven",
    lastOptimized: "2025-04-04T07:15:33.987654Z",
    impressions: 140898,
    clicks: 3025,
    orders: 139,
    units: 255,
    ctr: 2.1,
    cvr: 4.6,
    cpc: 0.38,
    spend: 1160.0,
    spendTrend: 2.4,
    sales: 12863.0,
    salesTrend: -2.9,
    acos: 9.0,
    acosTrend: 0.4,
    rpc: 4.25,
    trend: {
      sales: [
        13200, 13150, 13100, 13050, 13000, 12950, 12900, 12850, 12800, 12750, 12700, 12750, 12800, 12850, 12900, 12950,
        13000, 13050, 13000, 12950, 12900, 12850, 12800, 12750, 12800, 12850, 12900, 12950, 12900, 12863,
      ],
      spend: [
        1100, 1110, 1120, 1130, 1140, 1150, 1160, 1170, 1180, 1190, 1200, 1190, 1180, 1170, 1160, 1150, 1140, 1130,
        1140, 1150, 1160, 1170, 1180, 1190, 1180, 1170, 1160, 1150, 1155, 1160,
      ],
    },
    date: "2025-03-15",
  },
  {
    id: "camp4",
    adType: "SB",
    campaign: "VC3865-MWD-PGR-126 - SBA - Brand - Y",
    state: "ENABLED",
    optGroup: "VC3865 - Discovery",
    lastOptimized: "2025-03-20T09:45:12.345678Z",
    impressions: 98765,
    clicks: 2345,
    orders: 187,
    units: 312,
    ctr: 2.4,
    cvr: 8.0,
    cpc: 0.42,
    spend: 984.9,
    spendTrend: 1.2,
    sales: 15678.5,
    salesTrend: 3.5,
    acos: 6.3,
    acosTrend: -2.1,
    rpc: 6.69,
    trend: {
      sales: [
        15000, 15100, 15200, 15300, 15400, 15500, 15600, 15700, 15600, 15500, 15400, 15300, 15400, 15500, 15600, 15700,
        15600, 15500, 15400, 15500, 15600, 15700, 15600, 15500, 15600, 15700, 15600, 15700, 15650, 15678.5,
      ],
      spend: [
        950, 955, 960, 965, 970, 975, 980, 985, 990, 995, 1000, 995, 990, 985, 980, 975, 970, 975, 980, 985, 990, 985,
        980, 975, 980, 985, 980, 985, 980, 984.9,
      ],
    },
    date: "2025-03-20",
  },
  {
    id: "camp5",
    adType: "SD",
    campaign: "VC4123-MWD-WM-128 - SDA - Product Targeting - Y",
    state: "ENABLED",
    optGroup: "Profit",
    lastOptimized: "2025-03-25T16:20:45.678901Z",
    impressions: 76543,
    clicks: 1234,
    orders: 98,
    units: 145,
    ctr: 1.6,
    cvr: 7.9,
    cpc: 0.65,
    spend: 802.1,
    spendTrend: -0.8,
    sales: 9876.4,
    salesTrend: 1.7,
    acos: 8.1,
    acosTrend: -2.5,
    rpc: 8.0,
    trend: {
      sales: [
        9600, 9650, 9700, 9750, 9800, 9850, 9900, 9850, 9800, 9750, 9800, 9850, 9900, 9850, 9800, 9750, 9800, 9850,
        9900, 9850, 9800, 9850, 9900, 9850, 9800, 9850, 9900, 9850, 9900, 9876.4,
      ],
      spend: [
        820, 818, 816, 814, 812, 810, 808, 806, 804, 802, 800, 802, 804, 806, 808, 806, 804, 802, 800, 802, 804, 806,
        804, 802, 800, 802, 804, 802, 800, 802.1,
      ],
    },
    date: "2025-03-25",
  },
  {
    id: "camp6",
    adType: "SP",
    campaign: "VC6789-MWD-PGR-140 - SPA - Exact Match - Y",
    state: "PAUSED",
    optGroup: "Not Set",
    lastOptimized: "2025-03-10T11:30:15.123456Z",
    impressions: 54321,
    clicks: 876,
    orders: 43,
    units: 67,
    ctr: 1.6,
    cvr: 4.9,
    cpc: 0.91,
    spend: 797.2,
    spendTrend: 5.3,
    sales: 3456.7,
    salesTrend: -8.2,
    acos: 23.1,
    acosTrend: 14.7,
    rpc: 3.95,
    trend: {
      sales: [
        3800, 3750, 3700, 3650, 3600, 3550, 3500, 3450, 3400, 3350, 3400, 3450, 3500, 3550, 3500, 3450, 3400, 3350,
        3400, 3450, 3500, 3450, 3400, 3350, 3400, 3450, 3500, 3450, 3400, 3456.7,
      ],
      spend: [
        750, 755, 760, 765, 770, 775, 780, 785, 790, 795, 790, 785, 780, 775, 780, 785, 790, 795, 790, 785, 780, 785,
        790, 795, 790, 785, 790, 795, 790, 797.2,
      ],
    },
    date: "2025-03-30",
  },
  {
    id: "camp7",
    adType: "SB",
    campaign: "VC7890-MWD-WM-142 - SBA - Category - Y",
    state: "ENABLED",
    optGroup: "Discovery",
    lastOptimized: "2025-04-01T08:15:30.987654Z",
    impressions: 123456,
    clicks: 4321,
    orders: 321,
    units: 456,
    ctr: 3.5,
    cvr: 7.4,
    cpc: 0.48,
    spend: 2074.1,
    spendTrend: 2.1,
    sales: 23456.8,
    salesTrend: 5.4,
    acos: 8.8,
    acosTrend: -3.1,
    rpc: 5.43,
    trend: {
      sales: [
        22000, 22100, 22200, 22300, 22400, 22500, 22600, 22700, 22800, 22900, 23000, 23100, 23200, 23300, 23400, 23500,
        23400, 23300, 23400, 23500, 23600, 23500, 23400, 23500, 23600, 23500, 23400, 23500, 23400, 23456.8,
      ],
      spend: [
        2000, 2010, 2020, 2030, 2040, 2050, 2060, 2070, 2080, 2090, 2080, 2070, 2060, 2050, 2060, 2070, 2080, 2090,
        2080, 2070, 2060, 2070, 2080, 2070, 2060, 2070, 2080, 2070, 2080, 2074.1,
      ],
    },
    date: "2025-04-01",
  },
  {
    id: "camp8",
    adType: "SP",
    campaign: "VC8901-MWD-PGR-144 - SPA - Broad Match - Y",
    state: "ENABLED",
    optGroup: "Breakeven",
    lastOptimized: "2025-04-03T14:45:22.345678Z",
    impressions: 87654,
    clicks: 1543,
    orders: 112,
    units: 178,
    ctr: 1.8,
    cvr: 7.3,
    cpc: 0.53,
    spend: 817.8,
    spendTrend: -1.5,
    sales: 10987.6,
    salesTrend: 2.3,
    acos: 7.4,
    acosTrend: -3.7,
    rpc: 7.12,
    trend: {
      sales: [
        10700, 10750, 10800, 10850, 10900, 10950, 11000, 10950, 10900, 10850, 10900, 10950, 11000, 10950, 10900, 10850,
        10900, 10950, 11000, 10950, 10900, 10950, 11000, 10950, 10900, 10950, 11000, 10950, 11000, 10987.6,
      ],
      spend: [
        830, 828, 826, 824, 822, 820, 818, 816, 814, 812, 814, 816, 818, 820, 818, 816, 814, 812, 814, 816, 818, 816,
        814, 812, 814, 816, 818, 816, 818, 817.8,
      ],
    },
    date: "2025-04-03",
  },
  {
    id: "camp9",
    adType: "SD",
    campaign: "VC9012-MWD-WM-146 - SDA - Audience - Y",
    state: "ENABLED",
    optGroup: "Profit",
    lastOptimized: "2025-03-18T10:25:15.456789Z",
    impressions: 65432,
    clicks: 987,
    orders: 76,
    units: 98,
    ctr: 1.5,
    cvr: 7.7,
    cpc: 0.72,
    spend: 710.6,
    spendTrend: 0.9,
    sales: 8765.4,
    salesTrend: 1.8,
    acos: 8.1,
    acosTrend: -0.9,
    rpc: 8.88,
    trend: {
      sales: [
        8600, 8620, 8640, 8660, 8680, 8700, 8720, 8700, 8680, 8660, 8680, 8700, 8720, 8700, 8680, 8660, 8680, 8700,
        8720, 8700, 8680, 8700, 8720, 8700, 8720, 8740, 8760, 8740, 8760, 8765.4,
      ],
      spend: [
        700, 702, 704, 706, 708, 710, 712, 710, 708, 706, 708, 710, 712, 710, 708, 706, 708, 710, 712, 710, 708, 710,
        712, 710, 708, 710, 712, 710, 712, 710.6,
      ],
    },
    date: "2025-03-18",
  },
  {
    id: "camp10",
    adType: "SP",
    campaign: "VC0123-MWD-PGR-148 - SPA - Auto 1 Close Match - Y",
    state: "ENABLED",
    optGroup: "Discovery",
    lastOptimized: "2025-03-22T13:40:18.789012Z",
    impressions: 109876,
    clicks: 2109,
    orders: 156,
    units: 234,
    ctr: 1.9,
    cvr: 7.4,
    cpc: 0.61,
    spend: 1286.5,
    spendTrend: 1.3,
    sales: 14321.0,
    salesTrend: 3.2,
    acos: 9.0,
    acosTrend: -1.8,
    rpc: 6.79,
    trend: {
      sales: [
        13800, 13850, 13900, 13950, 14000, 14050, 14100, 14150, 14200, 14250, 14200, 14150, 14200, 14250, 14300, 14250,
        14200, 14250, 14300, 14250, 14200, 14250, 14300, 14250, 14300, 14350, 14300, 14350, 14300, 14321.0,
      ],
      spend: [
        1260, 1265, 1270, 1275, 1280, 1285, 1290, 1285, 1280, 1275, 1280, 1285, 1290, 1285, 1280, 1275, 1280, 1285,
        1290, 1285, 1280, 1285, 1290, 1285, 1280, 1285, 1290, 1285, 1290, 1286.5,
      ],
    },
    date: "2025-03-22",
  },
  {
    id: "camp11",
    adType: "SP",
    campaign: "VC1234-MWD-WM-150 - SPA - Auto 2 Substitutes - Y",
    state: "PAUSED",
    optGroup: "Not Set",
    lastOptimized: "2025-03-12T09:10:25.678901Z",
    impressions: 43210,
    clicks: 765,
    orders: 32,
    units: 45,
    ctr: 1.8,
    cvr: 4.2,
    cpc: 0.88,
    spend: 673.2,
    spendTrend: 4.7,
    sales: 2345.6,
    salesTrend: -6.8,
    acos: 28.7,
    acosTrend: 12.3,
    rpc: 3.07,
    trend: {
      sales: [
        2500, 2480, 2460, 2440, 2420, 2400, 2380, 2360, 2340, 2320, 2340, 2360, 2380, 2360, 2340, 2320, 2340, 2360,
        2340, 2320, 2340, 2360, 2340, 2320, 2340, 2360, 2340, 2320, 2340, 2345.6,
      ],
      spend: [
        640, 645, 650, 655, 660, 665, 670, 675, 680, 685, 680, 675, 670, 665, 670, 675, 680, 675, 670, 665, 670, 675,
        670, 665, 670, 675, 670, 675, 670, 673.2,
      ],
    },
    date: "2025-03-12",
  },
  {
    id: "camp12",
    adType: "SB",
    campaign: "VC2345-MWD-PGR-152 - SBA - Brand - Y",
    state: "ENABLED",
    optGroup: "Breakeven",
    lastOptimized: "2025-03-27T15:35:40.123456Z",
    impressions: 76543,
    clicks: 1876,
    orders: 143,
    units: 198,
    ctr: 2.5,
    cvr: 7.6,
    cpc: 0.57,
    spend: 1069.3,
    spendTrend: -0.6,
    sales: 12345.7,
    salesTrend: 2.1,
    acos: 8.7,
    acosTrend: -2.6,
    rpc: 6.58,
    trend: {
      sales: [
        12000, 12050, 12100, 12150, 12200, 12250, 12300, 12350, 12300, 12250, 12300, 12350, 12400, 12350, 12300, 12350,
        12400, 12350, 12300, 12350, 12400, 12350, 12300, 12350, 12400, 12350, 12300, 12350, 12300, 12345.7,
      ],
      spend: [
        1080, 1078, 1076, 1074, 1072, 1070, 1068, 1066, 1064, 1062, 1064, 1066, 1068, 1070, 1068, 1066, 1064, 1066,
        1068, 1070, 1068, 1066, 1064, 1066, 1068, 1070, 1068, 1066, 1068, 1069.3,
      ],
    },
    date: "2025-03-27",
  },
  {
    id: "camp13",
    adType: "SD",
    campaign: "VC3456-MWD-WM-154 - SDA - Product Targeting - Y",
    state: "ENABLED",
    optGroup: "Profit",
    lastOptimized: "2025-04-05T12:15:35.456789Z",
    impressions: 54321,
    clicks: 987,
    orders: 87,
    units: 123,
    ctr: 1.8,
    cvr: 8.8,
    cpc: 0.63,
    spend: 621.8,
    spendTrend: -1.2,
    sales: 9876.5,
    salesTrend: 2.5,
    acos: 6.3,
    acosTrend: -3.6,
    rpc: 10.01,
    trend: {
      sales: [
        9600, 9650, 9700, 9750, 9800, 9850, 9900, 9850, 9800, 9750, 9800, 9850, 9900, 9850, 9800, 9850, 9900, 9850,
        9800, 9850, 9900, 9850, 9800, 9850, 9900, 9850, 9900, 9850, 9900, 9876.5,
      ],
      spend: [
        630, 628, 626, 624, 622, 620, 618, 616, 618, 620, 622, 620, 618, 616, 618, 620, 622, 620, 618, 620, 622, 620,
        618, 620, 622, 620, 622, 620, 622, 621.8,
      ],
    },
    date: "2025-04-05",
  },
  {
    id: "camp14",
    adType: "SP",
    campaign: "VC4567-MWD-PGR-156 - SPA - Exact Match - Y",
    state: "ENABLED",
    optGroup: "Discovery",
    lastOptimized: "2025-03-14T11:05:22.345678Z",
    impressions: 98765,
    clicks: 2345,
    orders: 176,
    units: 245,
    ctr: 2.4,
    cvr: 7.5,
    cpc: 0.52,
    spend: 1219.4,
    spendTrend: 0.8,
    sales: 15432.1,
    salesTrend: 3.1,
    acos: 7.9,
    acosTrend: -2.2,
    rpc: 6.58,
    trend: {
      sales: [
        14900, 14950, 15000, 15050, 15100, 15150, 15200, 15250, 15300, 15350, 15300, 15250, 15300, 15350, 15400, 15350,
        15300, 15350, 15400, 15350, 15300, 15350, 15400, 15350, 15400, 15450, 15400, 15450, 15400, 15432.1,
      ],
      spend: [
        1200, 1205, 1210, 1215, 1220, 1225, 1220, 1215, 1210, 1215, 1220, 1225, 1220, 1215, 1220, 1225, 1220, 1215,
        1220, 1225, 1220, 1215, 1220, 1225, 1220, 1215, 1220, 1215, 1220, 1219.4,
      ],
    },
    date: "2025-03-14",
  },
  {
    id: "camp15",
    adType: "SB",
    campaign: "VC5678-MWD-WM-158 - SBA - Category - Y",
    state: "ENABLED",
    optGroup: "Breakeven",
    lastOptimized: "2025-03-31T09:50:15.678901Z",
    impressions: 87654,
    clicks: 1987,
    orders: 154,
    units: 213,
    ctr: 2.3,
    cvr: 7.8,
    cpc: 0.59,
    spend: 1172.3,
    spendTrend: -0.5,
    sales: 14567.8,
    salesTrend: 2.7,
    acos: 8.0,
    acosTrend: -3.1,
    rpc: 7.33,
    trend: {
      sales: [
        14100, 14150, 14200, 14250, 14300, 14350, 14400, 14450, 14500, 14550, 14500, 14450, 14500, 14550, 14600, 14550,
        14500, 14550, 14600, 14550, 14500, 14550, 14600, 14550, 14600, 14550, 14600, 14550, 14600, 14567.8,
      ],
      spend: [
        1180, 1178, 1176, 1174, 1172, 1170, 1168, 1166, 1168, 1170, 1172, 1170, 1168, 1170, 1172, 1170, 1168, 1170,
        1172, 1170, 1168, 1170, 1172, 1170, 1172, 1170, 1172, 1170, 1172, 1172.3,
      ],
    },
    date: "2025-03-31",
  },
]

// Export a function to get campaigns filtered by date range
export function getCampaignsByDateRange(from: Date, to: Date): Campaign[] {
  return mockCampaigns.filter((campaign) => {
    const campaignDate = new Date(campaign.date)
    return campaignDate >= from && campaignDate <= to
  })
}
