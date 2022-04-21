import { isBrowser } from '@novu/shared';

export const API_URL =
  isBrowser() && (window as any).Cypress
    ? window._env_.REACT_APP_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:1336'
    : window._env_.REACT_APP_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:3000';
export const WS_URL =
  isBrowser() && (window as any).Cypress
    ? window._env_.REACT_APP_WS_URL || process.env.REACT_APP_WS_URL || 'http://localhost:1340'
    : window._env_.REACT_APP_WS_URL || process.env.REACT_APP_WS_URL || 'http://localhost:3002';
