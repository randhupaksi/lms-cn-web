import { useSyncExternalStore } from "react";

const SIDEBAR_COLLAPSED_KEY = "citra-negara-lms:sidebar-collapsed";
const SIDEBAR_PREFERENCE_EVENT = "citra-negara-lms:sidebar-preference-change";

function subscribeToSidebarPreference(onChange: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", onChange);
  window.addEventListener(SIDEBAR_PREFERENCE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(SIDEBAR_PREFERENCE_EVENT, onChange);
  };
}

function getServerSidebarPreference() {
  return false;
}

export function readSidebarCollapsedPreference() {
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
  } catch {
    return false;
  }
}

export function writeSidebarCollapsedPreference(collapsed: boolean) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
  } catch {
    // Keep the current in-memory preference when storage is unavailable.
  }

  window.dispatchEvent(new Event(SIDEBAR_PREFERENCE_EVENT));
}

export function useSidebarCollapsedPreference() {
  return useSyncExternalStore(
    subscribeToSidebarPreference,
    readSidebarCollapsedPreference,
    getServerSidebarPreference,
  );
}
