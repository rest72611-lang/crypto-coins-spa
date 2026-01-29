import { ReactElement, useEffect, useState } from "react";
import { CoinCardModel } from "../../../Models/CoinCardModel";
import { CoinMoreInfoModel } from "../../../Models/CoinMoreInfoModel";
import { coinMoreInfoService } from "../../../../Services/CoinMoreInfoService";
import "./CoinCard.css";

// Props type definition (using `type` instead of `interface`)
// Keeps the component contract explicit and strongly typed.
type CoinCardProps = {
  coin: CoinCardModel;
  checked: boolean;
  onToggle: (coinId: string, checked: boolean) => void;
};

export function CoinCard({ coin, checked, onToggle }: CoinCardProps): ReactElement {
  // LocalStorage key is scoped per coin id
  // Allows remembering the "More Info" open/closed state per coin.
  const showKey = `showMore_${coin.id}`;

  // Initialize showMore from LocalStorage so UI state persists after refresh
  const [showMore, setShowMore] = useState<boolean>(
    localStorage.getItem(showKey) === "true"
  );

  // Holds the fetched coin details (null until loaded)
  const [moreInfo, setMoreInfo] = useState<CoinMoreInfoModel | null>(null);

  // Loading flag for the More Info request
  const [loading, setLoading] = useState<boolean>(false);

  // On first mount: if More Info is already open (from LocalStorage),
  // fetch the data once (only if not already in state).
  useEffect(() => {
    if (showMore && !moreInfo) {
      loadMoreInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // Intentionally run once on mount to restore persisted UI state.
  }, []);

  // Fetches more info from service layer (separation of concerns is good here)
  async function loadMoreInfo(): Promise<void> {
    setLoading(true);

    // NOTE: No try/catch here.
    // If the service throws, loading may remain true and UI may get stuck.
    // Consider adding error handling to avoid a broken state.
    const info = await coinMoreInfoService.getMoreInfo(coin.id);

    setMoreInfo(info);
    setLoading(false);
  }

  // Toggles the "More Info" section and persists state to LocalStorage.
  // Also triggers fetch only when opening and data isn't already loaded.
  function toggleMoreInfo(): void {
    const next = !showMore;
    setShowMore(next);
    localStorage.setItem(showKey, String(next));

    if (next && !moreInfo) {
      loadMoreInfo();
    }
  }

  return (
    // Card container for a single coin item
    <div className="CoinCard">
      <div className="CoinHeaderRow">
        <div className="CoinLeft">
          {/* Image alt text is good for accessibility */}
          <img className="CoinIcon" src={coin.image} alt={coin.name} />

          <div className="CoinText">
            {/* Uppercasing symbol at render time is fine for UI */}
            <div className="CoinSymbol">{coin.symbol.toUpperCase()}</div>
            <div className="CoinName">{coin.name}</div>
          </div>
        </div>

        {/* Custom switch UI (input + styled span) */}
        <div className="CoinSwitch">
          <input
            className="CoinSwitchInput"
            type="checkbox"
            checked={checked}
            // Delegates state changes to parent (controlled by parent) - good pattern.
            onChange={(e) => onToggle(coin.id, e.target.checked)}
          />
          <span className="CoinSwitchSlider" />
        </div>
      </div>

      {/* Button toggles the details section */}
      <button className="MoreInfoBtn" onClick={toggleMoreInfo}>
        {showMore ? "HIDE INFO" : "MORE INFO"}
      </button>

      {/* Conditional rendering keeps DOM clean when info is hidden */}
      {showMore && (
        <div className="MoreInfoBox">
          {/* Loading indicator is simple and clear */}
          {loading && <div>Loading...</div>}

          {/* Render only when data exists and not loading */}
          {!loading && moreInfo && (
            <>
              <div className="MoreInfoRow">
                <span>$</span>
                <span>{moreInfo.usd}</span>
              </div>
              <div className="MoreInfoRow">
                <span>€</span>
                <span>{moreInfo.eur}</span>
              </div>
              <div className="MoreInfoRow">
                <span>₪</span>
                <span>{moreInfo.ils}</span>
              </div>
            </>
          )}

          {/* NOTE: If request fails and service returns null/throws,
              the UI will show an empty box. Consider adding an error message. */}
        </div>
      )}
    </div>
  );
}







