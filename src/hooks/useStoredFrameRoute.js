import { useMemo } from 'react';
import { paths } from '../config/paths.js';
import { storageKeys } from '../config/storageKeys.js';
import { isToolRoute } from '../utils/routeUtils.js';

export function useStoredFrameRoute() {
  return useMemo(() => {
    try {
      const navigation = performance.getEntriesByType?.('navigation')?.[0];
      const isReload = navigation?.type === 'reload';
      if (!isReload || window.location.hash) return paths.homeDocument;

      const savedRoute = localStorage.getItem(storageKeys.currentFrameRoute);
      return savedRoute && isToolRoute(savedRoute) ? savedRoute : paths.homeDocument;
    } catch (error) {
      return paths.homeDocument;
    }
  }, []);
}
