export type AiCoinData = {
  name: string;
  current_price_usd: number;
  market_cap_usd: number;
  volume_24h_usd: number;
  price_change_percentage_30d_in_currency: number | null;
  price_change_percentage_60d_in_currency: number | null;
  price_change_percentage_200d_in_currency: number | null;
};
