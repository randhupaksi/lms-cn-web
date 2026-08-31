import axios from "axios";
import { appConfig } from "@/app/config/env";

export const apiClient = axios.create({ baseURL: appConfig.apiBaseUrl, timeout: 30_000, headers: { "Content-Type": "application/json" } });
