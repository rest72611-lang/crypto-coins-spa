import { cryptoReportsApi } from "./CryptoReportsApi";
import { PriceMultiUsdResponseModel } from "../Components/Models/PriceMultiUsdResponseModel";

// Service responsible for retrieving real-time prices
// from CryptoCompare API
class ReportsService {

  // Performs a single request that returns prices
  // for multiple symbols in USD
  public async getPricesUsd(
    symbols: string[]
  ): Promise<PriceMultiUsdResponseModel> {

    // Normalize symbols: uppercase, unique, and non-empty
    const unique = Array.from(
      new Set(symbols.map(s => s.toUpperCase()))
    ).filter(Boolean);

    // If no symbols provided, return empty result
    if (unique.length === 0) return {};

    // Convert symbols array to CSV string
    const csv = unique.join(",");

    // CryptoCompare endpoint:
    // GET /data/pricemulti?fsyms=BTC,ETH&tsyms=USD
    const res = await cryptoReportsApi.get<PriceMultiUsdResponseModel>(
      "/data/pricemulti",
      {
        params: {
          fsyms: csv,
          tsyms: "USD",
        },
      }
    );

    // Return raw response data
    return res.data;
  }
}

// Singleton instance
export const reportsService = new ReportsService();

