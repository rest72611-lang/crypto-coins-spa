import { ReactElement, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../Redux/Store";
import { coinsActions } from "../../../../Redux/CoinsSlice";

import { coinCardsService } from "../../../../Services/CoinCardsService";
import { maxCoinsService } from "../../../../Services/MaxCoinsService";
import { CoinsList } from "../CoinsList/CoinsList";

import "./CoinsPage.css";


import { notify } from "../../../../Utils/Notify";
import { Spinner } from "../../../SharedArea/spinner/spinner";
import { MaxCoins } from "../../../SharedArea/MaxCoins/MaxCoins";

type LayoutContext = { search: string };

export function CoinsPage(): ReactElement {
  // Read shared layout context (search value) from React Router Outlet
  const { search } = useOutletContext<LayoutContext>();

  // Redux dispatch
  const dispatch = useDispatch();

  // Redux state selectors
  const coins = useSelector((state: RootState) => state.coins.coins);
  const selectedIds = useSelector((state: RootState) => state.coins.selectedIds);

  // UI state: pending coin to add when max-selection is reached
  const [pendingId, setPendingId] = useState<string>("");

  // UI state: modal open/close
  const [isMaxOpen, setIsMaxOpen] = useState<boolean>(false);

  // Hydration guard to avoid persisting before initial LocalStorage load
  const [hydrated, setHydrated] = useState<boolean>(false);

  // Page loading indicator (used to show Spinner while fetching initial data)
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load coins from API → store in Redux
  useEffect(() => {
    setIsLoading(true);

    coinCardsService
      .getAllCards()
      .then((data) => dispatch(coinsActions.setCoins(data)))
      .catch((err) => notify.error(err))
      .finally(() => setIsLoading(false));
  }, [dispatch]);

  // Hydrate selectedIds from LocalStorage → Redux (once)
  useEffect(() => {
    const ids = coinCardsService.getSelectedIds().slice(0, 5);
    dispatch(coinsActions.setSelectedIds(ids));
    setHydrated(true);
  }, [dispatch]);

  // Persist selectedIds from Redux → LocalStorage (only after hydration)
  useEffect(() => {
    if (!hydrated) return;
    coinCardsService.saveSelectedIds(selectedIds.slice(0, 5));
  }, [selectedIds, hydrated]);

  // Filter coins based on search query (memoized for performance)
  const filteredCoins = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return coins;

    return coins.filter(
      (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
    );
  }, [coins, search]);

  // Compute modal options (id + symbol) from the current selection
  const modalOptions = useMemo(() => {
    return maxCoinsService.buildOptions(coins, selectedIds);
  }, [coins, selectedIds]);

  // Compute pending coin symbol for modal display
  const pendingSymbol = useMemo(() => {
    if (!pendingId) return "";
    const found = coins.find((c) => c.id === pendingId);
    return (found?.symbol ?? pendingId).toUpperCase();
  }, [coins, pendingId]);

  // Handle toggle selection from child cards
  function handleToggle(coinId: string, checked: boolean): void {
    // Unselect flow
    if (!checked) {
      dispatch(coinsActions.removeSelectedId(coinId));
      notify.coinRemoved();
      return;
    }

    // Ignore duplicates
    if (selectedIds.includes(coinId)) return;

    // Enforce max 5 selections by opening modal
    if (!maxCoinsService.canAdd(selectedIds)) {
      setPendingId(coinId);
      setIsMaxOpen(true);
      return;
    }

    // Select flow
    dispatch(coinsActions.addSelectedId(coinId));
    notify.coinAdded();
  }

  // Replace a selected coin with the pending one (modal confirm action)
  function replaceCoin(removeId: string): void {
    const next = maxCoinsService.replace(selectedIds, removeId, pendingId).slice(0, 5);
    dispatch(coinsActions.setSelectedIds(next));

    // Optional notifications (kept consistent with your existing UX)
    notify.coinRemoved();
    notify.coinAdded();

    closeModal();
  }

  // Close modal and reset pending selection
  function closeModal(): void {
    setIsMaxOpen(false);
    setPendingId("");
  }

  return (
    <div className="CoinsPage">
      {/* Show spinner while the page is loading initial coins data */}
      {isLoading ? (
        <Spinner />
      ) : (
        <CoinsList coins={filteredCoins} selectedIds={selectedIds} onToggle={handleToggle} />
      )}

      {/* Max-selection modal extracted to dedicated component (no duplicated JSX in this page) */}
      <MaxCoins
        isOpen={isMaxOpen}
        pendingSymbol={pendingSymbol}
        options={modalOptions}
        onConfirm={replaceCoin}
        onClose={closeModal}
      />
    </div>
  );
}







