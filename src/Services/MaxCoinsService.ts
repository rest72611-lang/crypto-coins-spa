import { CoinCardModel } from "../Components/Models/CoinCardModel";
import { MaxCoinsOption1 } from "../Components/Models/MaxCoinsOption1";

// Service responsible for enforcing the "maximum selected coins" rule
// and providing helper utilities for replacement logic
class MaxCoinsService {

  // Returns true if another coin can be added
  // (maximum allowed is 5)
  public canAdd(selectedIds: string[]): boolean {
    return selectedIds.length < 5;
  }

  // Builds a list of selectable options for the modal
  // Converts selected coin ids into { id, symbol } objects
  public buildOptions(
    allCoins: CoinCardModel[],
    selectedIds: string[]
  ): MaxCoinsOption1[] {

    // Create lookup map for fast id -> coin access
    const map = new Map(allCoins.map(c => [c.id, c]));

    return selectedIds
      // Convert id to coin object
      .map(id => map.get(id))

      // Remove undefined results
      .filter(Boolean)

      // Map to lightweight option model
      .map(c => ({
        id: c!.id,
        symbol: c!.symbol
      }));
  }

  // Replaces one selected coin with another
  // removeId -> coin to remove
  // addId    -> coin to add
  public replace(
    selectedIds: string[],
    removeId: string,
    addId: string
  ): string[] {

    // Remove the selected coin
    const without = selectedIds.filter(id => id !== removeId);

    // Add the new coin
    return [...without, addId];
  }
}

// Singleton instance
export const maxCoinsService = new MaxCoinsService();


