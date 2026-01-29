import axios from "axios";
import { appConfig } from "../Utils/AppConfig";

// Axios instance configured specifically for CryptoCompare API
// Centralizes base URL and common configuration
export const cryptoReportsApi = axios.create({
  // Base endpoint for CryptoCompare
  baseURL: appConfig.cryptoCompareBaseUrl,

  // Maximum waiting time for a response (in milliseconds)
  timeout: 15000,
});






