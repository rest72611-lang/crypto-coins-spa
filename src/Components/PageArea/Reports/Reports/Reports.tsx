import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "./Reports.css";

import { coinCardsService } from "../../../../Services/CoinCardsService";
import { reportsService } from "../../../../Services/ReportsService";
import { CoinCardModel } from "../../../Models/CoinCardModel";

// Chart point model:
// time is the x-axis label, and each selected symbol becomes a dynamic numeric field.
type ReportPoint = {
  time: string;
  [symbol: string]: string | number;
};

// Returns a time label for the chart (24h format).
// NOTE: Uses locale formatting; keep consistent across the app.
function nowTime(): string {
  return new Date().toLocaleTimeString("he-IL", { hour12: false });
}

export default function Reports(): ReactElement {
  // Holds full coins list (needed to map coin ids → symbols).
  const [allCoins, setAllCoins] = useState<CoinCardModel[]>([]);

  // Chart data points collected over time.
  const [points, setPoints] = useState<ReportPoint[]>([]);

  // UI error message (API/network failures).
  const [error, setError] = useState<string>("");

  // Keep interval id in a ref so we can reliably clear it on unmount.
  const intervalRef = useRef<number | null>(null);

  // Build a fast lookup map: coinId → SYMBOL.
  // Memoized to avoid rebuilding on every render.
  const idToSymbol = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of allCoins) map.set(c.id, c.symbol.toUpperCase());
    return map;
  }, [allCoins]);

  // Reads selected coin ids from storage and converts them to unique symbols.
  // NOTE: This is derived from LocalStorage, so it reflects "current selection"
  // even if the user changes selection on another page.
  function getSelectedSymbolsFromStorage(): string[] {
    const ids = coinCardsService.getSelectedIds();

    const symbols = ids
      .map((id) => idToSymbol.get(id))
      .filter(Boolean) as string[];

    // Ensure uniqueness (no duplicates in chart lines).
    return Array.from(new Set(symbols));
  }

  // Load full coins list once (needed for id → symbol mapping).
  useEffect(() => {
    coinCardsService
      .getAllCards()
      .then(setAllCoins)
      .catch(() => setError("Failed to load coins list."));
  }, []);

  // Start polling prices only after coins list is available.
  useEffect(() => {
    if (allCoins.length === 0) return;

    // One polling tick: read selected symbols, fetch prices, append a chart point.
    async function tick(): Promise<void> {
      try {
        setError("");

        const symbols = getSelectedSymbolsFromStorage();

        // If no coins selected, clear chart.
        if (symbols.length === 0) {
          setPoints([]);
          return;
        }

        // Fetch prices from CryptoCompare (via service layer).
        const prices = await reportsService.getPricesUsd(symbols);

        // Build a new point for this timestamp.
        const point: ReportPoint = { time: nowTime() };
        for (const sym of symbols) {
          const usd = prices?.[sym]?.USD;
          if (typeof usd === "number") point[sym] = usd;
        }

        // Keep only the last 60 points to avoid unbounded memory growth.
        setPoints((prev) => {
          const next = [...prev, point];
          return next.slice(-60);
        });
      } catch {
        setError("Reports API error (CryptoCompare).");
      }
    }

    // Run immediately so the chart shows data without waiting 1s.
    tick();

    // Poll every second.
    intervalRef.current = window.setInterval(tick, 1000);

    // Cleanup interval on unmount / dependency change.
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // Intentionally controlled polling lifecycle; dependencies are stable via memoization.
  }, [allCoins, idToSymbol]);

  // Compute selected symbols for rendering metadata and chart lines.
  const selectedSymbolsNow = useMemo(() => getSelectedSymbolsFromStorage(), [idToSymbol]);

  return (
    <div className="Reports">
      <div className="ReportsHeader">
        {/* Page title */}
        <h2>Real-Time Report (USD)</h2>

        {/* Metadata: how many coins are currently selected */}
        <div className="ReportsMeta">
          Selected: <b>{selectedSymbolsNow.length}</b> / 5
        </div>
      </div>

      {/* Empty state */}
      {selectedSymbolsNow.length === 0 && (
        <div className="ReportsMsg">No coins selected. Go back to Home and select up to 5 coins.</div>
      )}

      {/* Error message */}
      {error && <div className="ReportsError">{error}</div>}

      {/* Chart */}
      {selectedSymbolsNow.length > 0 && (
        <div className="ReportsChartWrap">
          <ResponsiveContainer width="100%" height={420}>
            <LineChart data={points}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              {/* Render one line per selected symbol */}
              {selectedSymbolsNow.map((sym) => (
                <Line key={sym} type="monotone" dataKey={sym} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}




