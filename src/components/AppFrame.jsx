import { useRef } from 'react';
import { storageKeys } from '../config/storageKeys.js';
import { buildFrameRoute, isToolRoute } from '../utils/routeUtils.js';

export default function AppFrame({ title, src, className }) {
  const frameRef = useRef(null);

  function rememberFrameRoute() {
    try {
      const frameLocation = frameRef.current?.contentWindow?.location;
      if (!frameLocation) return;

      const route = buildFrameRoute(frameLocation);
      if (isToolRoute(route)) {
        localStorage.setItem(storageKeys.currentFrameRoute, route);
        localStorage.setItem(storageKeys.lastToolRoute, route);
        return;
      }

      localStorage.removeItem(storageKeys.currentFrameRoute);
    } catch (error) {
      // Same-origin reads are expected; this keeps the frame harmless if deployment changes.
    }
  }

  return (
    <iframe
      ref={frameRef}
      title={title}
      src={src}
      className={className}
      onLoad={rememberFrameRoute}
    />
  );
}
