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

  const { search } = useOutletContext<LayoutContext>();
  const dispatch = useDispatch();

  // Raw Redux values
  const coinsRaw = useSelector((state: RootState) => state.coins.coins);
  const selectedIdsRaw = useSelector((state: RootState) => state.coins.selectedIds);

  // ✅ Guards
  const coins = Array.isArray(coinsRaw) ? coinsRaw : [];
  const selectedIds = Array.isArray(selectedIdsRaw) ? selectedIdsRaw : [];

  const [pendingId, setPendingId] = useState<string>("");
  const [isMaxOpen, setIsMaxOpen] = useState<boolean>(false);
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // =============================
  // Load coins from API
  // =============================
  useEffect(() => {
    setIsLoading(true);

    coinCardsService
      .getAllCards()
      .then((data) => {
        console.log("coins from api:", data);   // 👈 מינימלי לדיבוג
        dispatch(coinsActions.setCoins(data));
      })
      .catch((err) => notify.error(err))
      .finally(() => setIsLoading(false));

  }, [dispatch]);

  // =============================
  // Load selectedIds from storage
  // =============================
  useEffect(() => {
    const ids = coinCardsService.getSelectedIds().slice(0, 5);
    dispatch(coinsActions.setSelectedIds(ids));
    setHydrated(true);
  }, [dispatch]);

  // =============================
  // Save selectedIds to storage
  // =============================
  useEffect(() => {
    if (!hydrated) return;
    coinCardsService.saveSelectedIds(selectedIds.slice(0, 5));
  }, [selectedIds, hydrated]);

  // =============================
  // Filter by search
  // =============================
  const filteredCoins = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return coins;

    return coins.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q)
    );
  }, [coins, search]);

  // =============================
  // Modal options
  // =============================
  const modalOptions = useMemo(() => {
    return maxCoinsService.buildOptions(coins, selectedIds);
  }, [coins, selectedIds]);

  // =============================
  // Pending symbol
  // =============================
  const pendingSymbol = useMemo(() => {
    const id = pendingId ?? "";
    if (!id) return "";
    const found = coins.find(c => c.id === id);
    return String(found?.symbol ?? id).toUpperCase();
  }, [coins, pendingId]);

  // =============================
  // Toggle handler
  // =============================
  function handleToggle(coinId: string, checked: boolean): void {

    if (!checked) {
      dispatch(coinsActions.removeSelectedId(coinId));
      notify.coinRemoved();
      return;
    }

    if (selectedIds.includes(coinId)) return;

    if (!maxCoinsService.canAdd(selectedIds)) {
      setPendingId(coinId);
      setIsMaxOpen(true);
      return;
    }

    dispatch(coinsActions.addSelectedId(coinId));
    notify.coinAdded();
  }

  // =============================
  // Replace coin
  // =============================
  function replaceCoin(removeId: string): void {

    const next = maxCoinsService
      .replace(selectedIds, removeId, pendingId)
      .slice(0, 5);

    dispatch(coinsActions.setSelectedIds(next));

    notify.coinRemoved();
    notify.coinAdded();

    closeModal();
  }

  function closeModal(): void {
    setIsMaxOpen(false);
    setPendingId("");
  }

  // =============================
  // Render
  // =============================
  return (
    <div className="CoinsPage">

      {isLoading ? (
        <Spinner />
      ) : (
        <CoinsList
          coins={filteredCoins}
          selectedIds={selectedIds}
          onToggle={handleToggle}
        />
      )}

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







