import { useEffect, useMemo, useState } from "react";
import { MaxCoinsOption1 } from "../../Models/MaxCoinsOption1";
import "./MaxCoins.css";

// Props contract for MaxCoins modal
// isOpen        -> controls modal visibility
// pendingSymbol-> symbol of the coin the user attempted to add
// options       -> currently selected coins (candidates for removal)
// onConfirm     -> called with id of coin to remove
// onClose       -> closes the modal
type MaxCoinsProps = {
  isOpen: boolean;
  pendingSymbol: string;
  options: MaxCoinsOption1[];
  onConfirm: (removeId: string) => void;
  onClose: () => void;
};

export function MaxCoins(props: MaxCoinsProps) {
  const { isOpen, pendingSymbol, options, onConfirm, onClose } = props;

  // Pick first option as default selected removal candidate
  const firstId = useMemo(() => options[0]?.id ?? "", [options]);

  // Local state: which coin the user chose to remove
  const [removeId, setRemoveId] = useState<string>(firstId);

  // Reset selected radio whenever modal opens or options change
  useEffect(() => {
    if (isOpen) setRemoveId(firstId);
  }, [isOpen, firstId]);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (!isOpen) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Do not render anything if modal is closed
  if (!isOpen) return null;

  return (
    // Backdrop closes modal when clicking outside the card
    <div className="MaxCoinsBackdrop" onMouseDown={onClose}>
      <div className="MaxCoinsCard" onMouseDown={(e) => e.stopPropagation()}>
        {/* Modal title */}
        <div className="MaxCoinsTitle">Maximum Coins Reached</div>

        {/* System message */}
        <div className="MaxCoinsText">
          The system does not allow selecting more than 5 coins. <br />
          To add <b>{pendingSymbol.toUpperCase()}</b>, please choose one coin to remove.
        </div>

        {/* List of removable coins */}
        <div className="MaxCoinsList">
          {options.map((o) => (
            <label className="MaxCoinsRow" key={o.id}>
              <input
                type="radio"
                name="removeCoin"
                checked={removeId === o.id}
                onChange={() => setRemoveId(o.id)}
              />
              <span className="MaxCoinsSymbol">{o.symbol.toUpperCase()}</span>
            </label>
          ))}
        </div>

        {/* Action buttons */}
        <div className="MaxCoinsActions">
          <button
            className="MaxBtn MaxBtnConfirm"
            type="button"
            disabled={!removeId}
            onClick={() => onConfirm(removeId)}
          >
            CONFIRM
          </button>

          <button className="MaxBtn MaxBtnClose" type="button" onClick={onClose}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}



