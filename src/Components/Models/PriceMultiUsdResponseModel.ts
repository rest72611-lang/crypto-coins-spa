// CryptoCompare returns something like:
// {
//   "BTC": { "USD": 103000 },
//   "ETH": { "USD": 3100 }
// }

export type PriceMultiUsdResponseModel = Record<string, { USD: number }>;
