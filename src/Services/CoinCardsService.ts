import axios from "axios";
import { appConfig } from "../Utils/AppConfig";
import { CoinCardModel } from "../Components/Models/CoinCardModel";
import { getFromStorage, setToStorage, StorageKeys } from "../Utils/StorageKeys";

// Service responsible for:
// - Fetching coin cards from API
// - Managing selected coin ids in LocalStorage
class CoinCardsService {

  // Fetch all coin cards from CoinGecko API
  public async getAllCards(): Promise<CoinCardModel[]> {
    const response = await axios.get<CoinCardModel[]>(appConfig.CoinCardUrl);
    return response.data;
  }

  // Read selected coin ids from LocalStorage
  public getSelectedIds(): string[] {
    return getFromStorage<string[]>(StorageKeys.SelectedCoinIds, []);
  }

  // Persist selected coin ids to LocalStorage
  public saveSelectedIds(ids: string[]): void {
    setToStorage(StorageKeys.SelectedCoinIds, ids);
  }

  // Check if a specific coin is currently selected
  public isSelected(coinId: string): boolean {
    return this.getSelectedIds().includes(coinId);
  }

  // Toggle selection and persist result
  // NOTE: Currently not used in the project.
  // Kept for potential future features.
  public setSelected(coinId: string, checked: boolean): string[] {
    const selected = this.getSelectedIds();

    const next = checked
      ? Array.from(new Set([...selected, coinId]))
      : selected.filter(id => id !== coinId);

    setToStorage(StorageKeys.SelectedCoinIds, next);
    return next;
  }
}

export const coinCardsService = new CoinCardsService();


