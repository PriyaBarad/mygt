/**
 * Central configuration file.
 * EXPO_PUBLIC_API_BASE is automatically injected by Expo from the root .env file.
 * All API URLs in the app should be built from this base.
 */
export const API_BASE = process.env.EXPO_PUBLIC_API_BASE || "http://localhost:5000";
