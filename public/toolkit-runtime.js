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

  const FILE_LIMITS = Object.freeze({
    image: {
      label: 'image',
      maxBytes: 60 * 1024 * 1024,
      mimes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/heic', 'image/heif'],
      exts: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.heic', '.heif']
    },
    pdf: {
      label: 'PDF',
      maxBytes: 200 * 1024 * 1024,
      mimes: ['application/pdf'],
      exts: ['.pdf']
    }
  });

  function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${Math.round(bytes / 1024 / 1024)} MB`;
  }

  function fileNameLower(file) {
    return String(file?.name || '').toLowerCase();
  }

  function matchesRule(file, rule) {
    const type = String(file?.type || '').toLowerCase();
    const name = fileNameLower(file);
    return rule.mimes.includes(type) || rule.exts.some(ext => name.endsWith(ext));
  }

  function validateFiles(fileList, options = {}) {
    const files = Array.from(fileList || []);
    const rules = (options.kinds || ['image']).map(kind => FILE_LIMITS[kind]).filter(Boolean);
    const maxFiles = Number.isFinite(options.maxFiles) ? options.maxFiles : Infinity;
    const currentCount = Number.isFinite(options.currentCount) ? options.currentCount : 0;
    const maxBatchBytes = Number.isFinite(options.maxBatchBytes) ? options.maxBatchBytes : Infinity;
    const currentBytes = Number.isFinite(options.currentBytes) ? options.currentBytes : 0;
    const allowed = [];
    const rejected = [];
    let runningBytes = currentBytes;

    for (const file of files) {
      const rule = rules.find(item => matchesRule(file, item));
      if (!rule) {
        rejected.push({ file, reason: `${file.name || 'File'} is not supported. Use ${rules.map(item => item.label).join(' or ')} files.` });
        continue;
      }
      if (!file.size) {
        rejected.push({ file, reason: `${file.name || 'File'} is empty.` });
        continue;
      }
      if (file.size > rule.maxBytes) {
        rejected.push({ file, reason: `${file.name || rule.label} is too large. Max ${formatBytes(rule.maxBytes)}.` });
        continue;
      }
      if (currentCount + allowed.length >= maxFiles) {
        rejected.push({ file, reason: `File limit reached. Max ${maxFiles} files.` });
        continue;
      }
      if (runningBytes + file.size > maxBatchBytes) {
        rejected.push({ file, reason: `Batch is too large. Max ${formatBytes(maxBatchBytes)} total.` });
        continue;
      }
      runningBytes += file.size;
      allowed.push(file);
    }

    return { allowed, rejected };
  }

  function showValidationResult(result, options = {}) {
    if (result.allowed.length) return;
    const first = result.rejected[0];
    toast(first?.reason || options.fallback || 'No supported files found.');
  }

  window.PixCutSecurity = Object.freeze({
    FILE_LIMITS,
    formatBytes,
    validateFiles,
    showValidationResult,
    isSafeImageFile: file => matchesRule(file, FILE_LIMITS.image),
    isSafePdfFile: file => matchesRule(file, FILE_LIMITS.pdf)
  });

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
