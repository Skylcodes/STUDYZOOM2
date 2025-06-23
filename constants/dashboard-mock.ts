// Mock data for dashboard widgets
export const mockStats = [
  {
    id: 'revenue',
    title: 'Revenue',
    value: '$23,000',
    delta: 12,
    icon: 'dollar'
  },
  {
    id: 'users',
    title: 'Users',
    value: '2,300',
    delta: 7,
    icon: 'users'
  },
  {
    id: 'orders',
    title: 'Orders',
    value: '+3,052',
    delta: -2,
    icon: 'shopping-cart'
  },
  {
    id: 'profit',
    title: 'Profit',
    value: '$173,000',
    delta: 8,
    icon: 'trending-up'
  }
];

export const mockSatisfactionRate = {
  percentage: 95,
  title: 'Satisfaction Rate',
  subtitle: 'From all projects'
};

export const mockReferralTracking = {
  score: 9.3,
  title: 'Referral Tracking',
  invited: 145,
  clicks: 1_845
};

export const mockActiveUsers = {
  total: 32_984,
  clicks: 2_420_000,
  sales: 24_005,
  items: 320,
  chartData: [
    { name: 'Mon', value: 34 },
    { name: 'Tue', value: 45 },
    { name: 'Wed', value: 31 },
    { name: 'Thu', value: 45 },
    { name: 'Fri', value: 35 },
    { name: 'Sat', value: 46 },
    { name: 'Sun', value: 32 }
  ]
};

export const mockSalesOverview = {
  title: 'Sales overview',
  period: '8 Weeks in 2023',
  data: [
    { month: 'Jan', value: 400 },
    { month: 'Feb', value: 300 },
    { month: 'Mar', value: 500 },
    { month: 'Apr', value: 700 },
    { month: 'May', value: 400 },
    { month: 'Jun', value: 600 },
    { month: 'Jul', value: 800 },
    { month: 'Aug', value: 700 },
    { month: 'Sep', value: 900 },
    { month: 'Oct', value: 700 },
    { month: 'Nov', value: 800 },
    { month: 'Dec', value: 700 }
  ]
};

export const mockUser = {
  name: 'Mark Johnson',
  role: 'CEO / Co-Founder',
  message: 'Ask me anything.'
};
