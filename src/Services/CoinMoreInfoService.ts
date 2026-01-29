import axios from "axios";
import { appConfig } from "../Utils/AppConfig";
import { CoinMoreInfoModel } from "../Components/Models/CoinMoreInfoModel";

// Cache Time-To-Live (2 minutes)
const CACHE_TTL = 2 * 60 * 1000;

// Cached object extends the model with a timestamp
type CachedMoreInfo = CoinMoreInfoModel & {
  timestamp: number;
};

// Service responsible for fetching and caching
// lightweight "more info" data for a single coin
class CoinMoreInfoService {

  // Returns USD, EUR and ILS prices for a given coin
  // Uses LocalStorage cache to reduce API calls
  public async getMoreInfo(coinId: string): Promise<CoinMoreInfoModel | null> {

    const key = `moreInfo_${coinId}`;
    const cached = localStorage.getItem(key);

    // ===== Cache Layer =====
    if (cached) {
      try {
        const parsed: CachedMoreInfo = JSON.parse(cached);

        // Return cached value if still valid
        if (Date.now() - parsed.timestamp < CACHE_TTL) {
          console.log("CACHE:", coinId);
          return parsed;
        }
      } catch {
        // Ignore JSON parse errors and fallback to API
      }
    }

    // ===== API Layer =====
    try {
      console.log("API:", coinId);

      const response = await axios.get(
        `${appConfig.MoreInfoUrl}/${coinId}`
      );

      const prices = response.data?.market_data?.current_price;

      // Validate required currencies
      if (
        typeof prices?.usd !== "number" ||
        typeof prices?.eur !== "number" ||
        typeof prices?.ils !== "number"
      ) {
        return null;
      }

      // Build fresh model object
      const fresh: CoinMoreInfoModel = {
        usd: prices.usd,
        eur: prices.eur,
        ils: prices.ils,

        // Used for potential UI display or debugging
        lastUpdated: Date.now(),

        // Used internally for cache validation
        timestamp: Date.now(),
      };

      // Store in LocalStorage cache
      localStorage.setItem(key, JSON.stringify(fresh));

      return fresh;
    } catch {
      // Network or API error
      return null;
    }
  }
}

// Singleton instance
export const coinMoreInfoService = new CoinMoreInfoService();












