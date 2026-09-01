import axios from "axios";
import { publicEnv } from "@/config/public-env";

export const apiClient = axios.create({
  baseURL: publicEnv.apiBaseUrl,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});
