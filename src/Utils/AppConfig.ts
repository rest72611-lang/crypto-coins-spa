// src/Utils/AppConfig.ts

// Centralized configuration class
// Holds all external API base URLs and paths
export class AppConfig {

  // =========================
  // CoinGecko
  // =========================

  // Coins list for Home page
  // Returns ~100 coins ordered by market cap
  public readonly CoinCardUrl =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1";

  // Single coin details (used for AI recommendations)
  // Usage: `${CoinGeckoCoinUrl}/${coinId}?market_data=true`
  public readonly CoinGeckoCoinUrl =
    "https://api.coingecko.com/api/v3/coins";

  // Single coin details (used for More Info in CoinCard)
  // Usage: `${MoreInfoUrl}/${coinId}`
  public readonly MoreInfoUrl =
    "https://api.coingecko.com/api/v3/coins";

  // =========================
  // CryptoCompare (Reports)
  // =========================

  // Base URL for CryptoCompare API
  public readonly cryptoCompareBaseUrl =
    "https://min-api.cryptocompare.com";

  // Path for multiple price request
  public readonly cryptoComparePriceMultiPath =
    "/data/pricemulti";

  // =========================
  // OpenAI (Client Only)
  // =========================

  // Chat Completions endpoint (for direct HTTP usage if needed)
  public readonly openAiChatCompletionsUrl =
    "https://api.openai.com/v1/chat/completions";
}

// Singleton instance
export const appConfig = new AppConfig();








