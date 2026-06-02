(function registerOfflineSupport() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', function onLoad() {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function noop() {});
  });
})();
