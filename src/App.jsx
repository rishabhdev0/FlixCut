import { fallbackRoute, routes } from './config/routes.jsx';
import { normalizePath } from './utils/routeUtils.js';

export default function App() {
  const path = normalizePath(window.location.pathname);
  const Page = routes.find((route) => route.path === path)?.component || fallbackRoute;

  return <Page />;
}
