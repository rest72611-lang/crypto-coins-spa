import { ReactElement, useMemo, useState } from "react";
import { getFromStorage, StorageKeys } from "../../../../Utils/StorageKeys";

import { gptService } from "../../../../Services/GptService";

import "./Recommendations.css";
import { Prompt } from "../../../Models/prompt";
import { coinRecommendationDataService } from "../../../../Services/CoinGecko data";


type CoinOption = { id: string; label: string };

// Recommendations page: lets the user pick one selected coin and request an AI-generated recommendation.
export function Recommendations(): ReactElement {
  // Read selected coin ids from LocalStorage once (memoized)
  const selectedIds = useMemo(() => {
    return getFromStorage<string[]>(StorageKeys.SelectedCoinIds, []);
  }, []);

  // Build radio options from selected ids
  const options: CoinOption[] = useMemo(() => {
    return selectedIds.map((id) => ({ id, label: id }));
  }, [selectedIds]);

  // Default selection: first option (if exists)
  const [selectedId, setSelectedId] = useState<string>(options[0]?.id ?? "");

  // AI result HTML (rendered as-is)
  const [html, setHtml] = useState<string>("");

  // UI states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch coin data, build a strict prompt, call GPT service, and store HTML result.
  async function askRecommendation(): Promise<void> {
    try {
      setLoading(true);
      setError("");
      setHtml("");

      // Guard: must select a coin before requesting recommendation
      if (!selectedId) {
        setError("No coin selected.");
        return;
      }

      // 1) Fetch ONLY the required fields from CoinGecko (via service layer)
      const d = await coinRecommendationDataService.getAiCoinData(selectedId);

      // 2) Build payload with exact fields required by the prompt
      const payload = {
        name: d.name,
        current_price_usd: d.current_price_usd,
        market_cap_usd: d.market_cap_usd,
        volume_24h_usd: d.volume_24h_usd,
        price_change_percentage_30d_in_currency: d.price_change_percentage_30d_in_currency,
        price_change_percentage_60d_in_currency: d.price_change_percentage_60d_in_currency,
        price_change_percentage_200d_in_currency: d.price_change_percentage_200d_in_currency,
      };

      // 3) Build a strict prompt to get HTML only (no Markdown)
      // NOTE: Keeping output constraints reduces formatting noise.
      const prompt: Prompt = {
        systemContent:
          "You are a crypto recommendation assistant. Return HTML only (no Markdown). " +
          "Use only these tags: h2,h3,p,ul,li,table,tr,th,td,strong,em,br. " +
          "Do not write code blocks or backticks.",
        userContent:
          "The user requested a recommendation about buying the coin. " +
          "Base your answer ONLY on the provided data.\n\n" +
          "Return HTML that contains exactly:\n" +
          "1) <h2> coin name\n" +
          "2) <p><strong>Recommendation:</strong> exactly one word: Buy / Avoid</p>\n" +
          "3) <p>One explanation paragraph based on price/market cap/volume and 30/60/200 day changes</p>\n" +
          "4) <table> with columns: Pros | Cons | Risk Level</table>\n" +
          "5) <p><strong>Note:</strong> Not financial advice</p>\n\n" +
          "Coin data (JSON):\n" +
          JSON.stringify(payload, null, 2),
      };

      // 4) Call GPT and store returned HTML
      const resultHtml = await gptService.getCompletion(prompt);
      setHtml(resultHtml);
    } catch (err: any) {
      setError(err?.message ?? "Failed to get recommendation.");
    } finally {
      setLoading(false);
    }
  }

  // If user has no selected coins, show a friendly empty state
  if (!options.length) {
    return (
      <div className="Recommendations">
        <h2>Recommendations</h2>
        <p>No coins selected. Go back to Home and select up to 5 coins.</p>
      </div>
    );
  }

  return (
    <div className="Recommendations">
      <h2>Recommendations</h2>

      <div className="box">
        <h3>Select one coin</h3>

        <div className="radios">
          {options.map((opt) => (
            <label key={opt.id} className="radioRow">
              <input
                type="radio"
                name="coin"
                checked={selectedId === opt.id}
                onChange={() => setSelectedId(opt.id)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="askBtn" onClick={askRecommendation} disabled={loading || !selectedId}>
        {loading ? "Loading..." : "Get Recommendation"}
      </button>

      {error && <p className="error">{error}</p>}

      {html && (
        <div className="box aiResult">
          <h3>AI Result (HTML)</h3>
          {/* Rendering HTML directly - ensure gptService returns trusted/sanitized output */}
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      )}
    </div>
  );
}








