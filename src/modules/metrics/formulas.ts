export interface IMetricCalculations {
  conversionRate: number | null; // null represents "Not available"
  engagementRate: number | null; // null represents "Not available"
}

export const calculateConversionRate = (
  orders: number,
  enquiries: number
): number | null => {
  if (!enquiries || enquiries <= 0) {
    return null; // Not available
  }
  return Number(((orders / enquiries) * 100).toFixed(2));
};

export const calculateEngagementRate = (
  likes: number,
  comments: number,
  shares: number,
  followers: number
): number | null => {
  if (!followers || followers <= 0) {
    return null; // Not available
  }
  const totalInteractions = (likes || 0) + (comments || 0) + (shares || 0);
  return Number(((totalInteractions / followers) * 100).toFixed(2));
};

export const calculatePercentageChange = (
  current: number,
  previous: number
): number | null => {
  if (previous === 0) {
    return current > 0 ? 100 : null;
  }
  return Number((((current - previous) / previous) * 100).toFixed(1));
};
