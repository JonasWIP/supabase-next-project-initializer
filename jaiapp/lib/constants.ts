/**
 * Application constants
 */

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
};

// Auth
export const AUTH = {
  COOKIE_NAME: 'auth_session',
  MAX_AGE: 60 * 60 * 24 * 7, // 7 days
};

// API
export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  TIMEOUT: 10000,
};

// App config
export const CONFIG = {
  APP_NAME: 'SupaNext Template',
  THEME_COLOR: '#0ea5e9',
};