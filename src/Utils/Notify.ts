import { toast } from "react-toastify";

// Centralized notification service
// Responsible for displaying user-facing toast messages
class Notify {

  // Displays an error message
  // Attempts to extract a meaningful message from different error shapes
  public error(err: any): void {
    const serverMsg =
      err?.response?.data?.message ??
      err?.response?.data ??
      err?.message ??
      "Server error";

    toast.error(String(serverMsg));
  }

  // Shows success message when a coin is added
  public coinAdded(): void {
    toast.success("Coin added successfully");
  }

  // Shows info message when a coin is removed
  public coinRemoved(): void {
    toast.info("Coin removed successfully");
  }
}

// Singleton instance
export const notify = new Notify();


