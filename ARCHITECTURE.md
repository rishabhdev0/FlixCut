# PixCut Architecture

PixCut is split into two layers:

- `src/` is the React application shell. It owns routing, product metadata, shared React components, hooks, config, and the home experience.
- `public/tools/` contains the current production tool runtimes. These tools are legacy browser-native pages that keep heavy image/PDF processing close to plain JavaScript for performance and compatibility.

## React Shell

```text
src/
├── components/        Reusable UI and frame-level components
├── config/            Route, path, and storage configuration
├── constants/         Product/tool metadata
├── features/          One folder per product feature route
├── hooks/             Shared React hooks
├── pages/             Route-level pages
└── utils/             Pure helpers
```

The shell is intentionally data-driven:

- Tool metadata lives in `src/constants/tools.js`.
- Route construction lives in `src/config/routes.jsx`.
- Local-storage keys live in `src/config/storageKeys.js`.
- Home iframe persistence lives in `src/hooks/useStoredFrameRoute.js`.
- iframe rendering lives in `src/components/AppFrame.jsx`.

## Tool Runtime

Each legacy tool page has a feature folder for JavaScript behavior:

```text
public/tools/
├── bg-remover.html
├── bg-remover/js/
├── file-converter.html
├── file-converter/js/
└── ...
```

Shared runtime polish is kept separate:

- `public/toolkit-core.css` adds cross-tool visual consistency.
- `public/toolkit-runtime.js` adds browser safety guards and common runtime behavior.
- `public/sw.js` handles offline caching.

## Refactor Direction

Do not rewrite every tool at once. The safe path is:

1. Extract shared CSS from one tool into a feature-level CSS file.
2. Extract repeated markup into small render functions or React components.
3. Move pure logic into `utils/`.
4. Move stateful browser behavior into hooks or controller modules.
5. Keep large file handling and PDF/image processing tested after every slice.

This keeps the product working while gradually moving from legacy tool pages to feature modules.
