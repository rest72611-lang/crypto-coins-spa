import axios from "axios";
import { appConfig } from "../Utils/AppConfig";
import { AiCoinData } from "../Components/Models/AiCoinData";

// Partial type describing only the fields we actually use
// from CoinGecko coin details response
type CoinGeckoCoinsResponse = {
  name?: string;
  market_data?: {
    current_price?: { usd?: number };
    market_cap?: { usd?: number };
    total_volume?: { usd?: number };
    price_change_percentage_30d_in_currency?: { usd?: number };
    price_change_percentage_60d_in_currency?: { usd?: number };
    price_change_percentage_200d_in_currency?: { usd?: number };
  };
};

// Service responsible for retrieving and caching
// minimal CoinGecko data needed for AI recommendations
class CoinRecommendationDataService {

  // In-memory cache: coinId -> { timestamp, data }
  private cache = new Map<string, { at: number; data: AiCoinData }>();

  // Cache time-to-live (2 minutes)
  private ttlMs = 2 * 60 * 1000;

  // Fetches coin data for AI prompt (with caching)
  public async getAiCoinData(coinId: string): Promise<AiCoinData> {

    const now = Date.now();

    // Return cached value if still valid
    const cached = this.cache.get(coinId);
    if (cached && now - cached.at < this.ttlMs) {
      return cached.data;
    }

    // Build CoinGecko URL
    const url =
      `${appConfig.CoinGeckoCoinUrl}/${encodeURIComponent(coinId)}?market_data=true`;

    // Call CoinGecko API
    const res = await axios.get<CoinGeckoCoinsResponse>(url);
    const md = res.data.market_data;

    // Fallback to coinId if name is missing
    const name = res.data.name ?? coinId;

    // Extract required numeric fields
    const current = md?.current_price?.usd;
    const marketCap = md?.market_cap?.usd;
    const volume24h = md?.total_volume?.usd;

    // Validate critical fields
    if (
      typeof current !== "number" ||
      typeof marketCap !== "number" ||
      typeof volume24h !== "number"
    ) {
      throw new Error("CoinGecko: Missing required USD market data.");
    }

    // Build model used by AI layer
    const data: AiCoinData = {
      name,
      current_price_usd: current,
      market_cap_usd: marketCap,
      volume_24h_usd: volume24h,
      price_change_percentage_30d_in_currency:
        md?.price_change_percentage_30d_in_currency?.usd ?? null,
      price_change_percentage_60d_in_currency:
        md?.price_change_percentage_60d_in_currency?.usd ?? null,
      price_change_percentage_200d_in_currency:
        md?.price_change_percentage_200d_in_currency?.usd ?? null,
    };

    // Store in cache
    this.cache.set(coinId, { at: now, data });

    return data;
  }
}

// Singleton instance
export const coinRecommendationDataService =
  new CoinRecommendationDataService();

