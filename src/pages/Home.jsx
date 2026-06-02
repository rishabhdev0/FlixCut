import { useMemo, useRef } from 'react';

const FRAME_ROUTE_KEY = 'pixcut.currentFrameRoute';
const LAST_TOOL_KEY = 'pixcut.lastToolRoute';
const HOME_FRAME = '/legacy-index.html';

export default function Home() {
  const frameRef = useRef(null);
  const initialSrc = useMemo(() => {
    try {
      const savedRoute = localStorage.getItem(FRAME_ROUTE_KEY);
      return savedRoute?.startsWith('/tools/') ? savedRoute : HOME_FRAME;
    } catch (error) {
      return HOME_FRAME;
    }
  }, []);

  function rememberFrameRoute() {
    try {
      const frameLocation = frameRef.current?.contentWindow?.location;
      if (!frameLocation) return;

      const route = `${frameLocation.pathname}${frameLocation.search}${frameLocation.hash}`;
      if (route.startsWith('/tools/')) {
        localStorage.setItem(FRAME_ROUTE_KEY, route);
        localStorage.setItem(LAST_TOOL_KEY, route);
        return;
      }

      localStorage.removeItem(FRAME_ROUTE_KEY);
    } catch (error) {
      // Same-origin reads are expected here; this guard keeps the frame harmless if that changes.
    }
  }

  return (
    <iframe
      ref={frameRef}
      title="PixCut"
      src={initialSrc}
      className="exact-page-frame"
      onLoad={rememberFrameRoute}
    />
  );
}
