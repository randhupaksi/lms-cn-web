let accessToken: string | null = null;
type SessionInvalidationListener = (message: string) => void;
const invalidationListeners = new Set<SessionInvalidationListener>();

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function clearAccessToken() {
  accessToken = null;
}

export function invalidateSession(
  message = "Sesi Anda telah berakhir. Silakan masuk kembali.",
) {
  clearAccessToken();
  invalidationListeners.forEach((listener) => listener(message));
}

export function subscribeToSessionInvalidation(
  listener: SessionInvalidationListener,
) {
  invalidationListeners.add(listener);
  return () => {
    invalidationListeners.delete(listener);
  };
}
