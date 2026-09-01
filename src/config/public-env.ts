const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

export const publicEnv = Object.freeze({
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Citra Negara LMS",
  apiBaseUrl,
});
