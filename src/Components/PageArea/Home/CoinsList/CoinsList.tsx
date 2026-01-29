import { ReactElement } from "react";
import { CoinCardModel } from "../../../Models/CoinCardModel";
import "./CoinsList.css";
import { CoinCard } from "../CoinCard/CoinCard";

// Props type definition using `type` instead of `interface`
type CoinsListProps = {
  coins: CoinCardModel[];
  selectedIds: string[];
  onToggle: (coinId: string, checked: boolean) => void;
};

// CoinsList renders a collection of CoinCard components
// and delegates selection handling to the parent.
export function CoinsList(props: CoinsListProps): ReactElement {
  return (
    // Container for the list of coin cards
    <div className="CoinsList">

      {/* Iterate over all coins and render a CoinCard for each one */}
      {props.coins.map(c => (

        <CoinCard
          // Unique key is required for React list rendering
          key={c.id}

          // Full coin model passed down to card
          coin={c}

          // Determine if coin is selected based on selectedIds array
          checked={props.selectedIds.includes(c.id)}

          // Pass toggle handler to child component
          onToggle={props.onToggle}
        />

      ))}

    </div>
  );
}




