(function installPixCutRuntimeGuards() {
  const toast = window.toast || function fallbackToast(message) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(el._pcTimer);
    el._pcTimer = setTimeout(() => el.classList.remove('show'), 2800);
  };

  function isInsideDropTarget(target) {
    return Boolean(target?.closest?.('#drop-zone,.drop-zone,[data-drop-zone]'));
  }

  function installDropSafety() {
    ['dragover', 'drop'].forEach(type => {
      document.addEventListener(type, event => {
        if (isInsideDropTarget(event.target)) return;
        event.preventDefault();
      });
    });
  }

  function installFileRetrySafety() {
    document.querySelectorAll('input[type="file"]').forEach(input => {
      input.addEventListener('change', () => {
        setTimeout(() => {
          try { input.value = ''; } catch (error) {}
        }, 0);
      });
    });
  }

  function markToolState() {
    const path = location.pathname;
    if (path.startsWith('/tools/')) {
      try { localStorage.setItem('pixcut.lastToolRoute', path + location.search + location.hash); } catch (error) {}
    }
  }

  function installNetworkState() {
    const setState = () => document.documentElement.classList.toggle('is-offline', !navigator.onLine);
    window.addEventListener('online', () => { setState(); toast('Back online'); });
    window.addEventListener('offline', () => { setState(); toast('Offline mode active'); });
    setState();
  }

  function installErrorBoundaryToast() {
    window.addEventListener('unhandledrejection', event => {
      const message = String(event.reason?.message || event.reason || '');
      if (!message || message.includes('Abort') || message.includes('cancel')) return;
      toast('Something failed. Try again or reload the tool.');
    });
  }

  function init() {
    installDropSafety();
    installFileRetrySafety();
    installNetworkState();
    installErrorBoundaryToast();
    markToolState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
