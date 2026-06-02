export function normalizePath(pathname) {
  return pathname.replace(/\/+$/, '') || '/';
}

export function isToolRoute(route) {
  return route.startsWith('/tools/');
}

export function buildFrameRoute(locationLike) {
  return `${locationLike.pathname}${locationLike.search}${locationLike.hash}`;
}
