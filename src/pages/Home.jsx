import AppFrame from '../components/AppFrame.jsx';
import { useStoredFrameRoute } from '../hooks/useStoredFrameRoute.js';

export default function Home() {
  const initialSrc = useStoredFrameRoute();

  return (
    <AppFrame
      title="PixCut"
      src={initialSrc}
      className="exact-page-frame"
    />
  );
}
