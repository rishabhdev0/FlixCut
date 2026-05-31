# ✂️ FlixCut

FlixCut is a privacy-first image and PDF toolkit built for fast, everyday browser workflows. It brings common utilities like background removal, file conversion, compression, PDF merging, scan-to-PDF, and PDF encryption into one clean web app.

The project is designed as a placement-ready frontend project: modular source structure, reusable components, route-level pages, self-contained tool modules, security headers, responsive layouts, and local-first processing wherever possible.

## 🚀 Features

- ✂️ **Background Remover**  
  Upload an image, remove or refine the background, edit masks, adjust canvas size, add text overlays, compare before/after, and download the final result.

- 🔄 **File Converter**  
  Convert images between formats, convert images to PDF, export PDF pages as images, batch process files, rename outputs, adjust quality, resize, filter, and download as ZIP.

- 📎 **Merge PDF**  
  Merge PDFs and images into one document, reorder files, select PDF page ranges, rotate pages, add watermark text, edit metadata, and encrypt output PDFs.

- 🗜️ **Compress PDF**  
  Compress PDF files with multiple optimization levels for screen, ebook, printer, and lossless-style workflows.

- 🖼️ **Image Compressor**  
  Compress images to target sizes, choose quality presets, batch process files, and download optimized outputs.

- 📷 **Scan to PDF**  
  Capture images from camera or upload photos, crop camera captures, apply scan filters, reorder pages, preview pages, and generate a PDF.

- 🚧 **Add Image to PDF**  
  Coming soon placeholder page, kept intentionally simple until the feature is ready.

## 🔒 Privacy First

FlixCut is built around local-first processing:

- Files are handled in the browser whenever possible.
- No account or login is required.
- No default upload pipeline is used for ordinary processing.
- PDF encryption runs locally through a WebAssembly QPDF build.
- Security headers are included for supported hosting platforms.

> Note: AI background removal uses a browser-side AI package and may download model files from a CDN on first use. After that, browser caching can reduce repeated loading.

## 🧱 Tech Stack

- ⚛️ React
- ⚡ Vite
- 🎨 CSS / tool-specific HTML interfaces
- 📄 PDF-Lib
- 📚 PDF.js
- 🔐 QPDF WebAssembly
- 🧠 Browser-side background removal package

## 📁 Project Structure

```text
FlixCut/
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── responsive.css
│   ├── _headers
│   ├── vendor/
│   │   └── qpdf/
│   │       └── qpdf.mjs
│   └── tools/
│       ├── bg-remover.html
│       ├── bg-remover/js/
│       ├── file-converter.html
│       ├── file-converter/js/
│       ├── merge-pdf.html
│       ├── merge-pdf/js/
│       ├── image-compress.html
│       ├── image-compress/js/
│       ├── compress-pdf.html
│       ├── compress-pdf/js/
│       ├── scan-to-pdf.html
│       ├── scan-to-pdf/js/
│       └── add-image-pdf.html
│
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── global.css
│   ├── components/
│   ├── constants/
│   ├── features/
│   ├── hooks/
│   ├── pages/
│   └── utils/
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── vercel.json
└── README.md
```

## 🧩 Modular Tool Scripts

The larger tool pages are split into smaller feature-focused scripts for readability and maintenance.

Examples:

```text
public/tools/bg-remover/js/
├── 06-file-loading.js
├── 08-render.js
├── 13-magic-wand.js
├── 19-ai-removal.js
├── 23-adjustments.js
└── 26-download-dropdown.js
```

```text
public/tools/file-converter/js/
├── 05-file-input.js
├── 06-render-list.js
├── 08-convert.js
├── 09-img-img.js
├── 10-img-pdf.js
└── 11-pdf-images.js
```

## 🛠️ Getting Started

Clone the repository:

```bash
git clone https://github.com/rishabhdev0/FlixCut.git
cd FlixCut
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## ✅ Verification

The project has been checked with:

```bash
npm run build
npm audit --audit-level=moderate
```

Current status:

- ✅ Production build passes
- ✅ Dependency audit passes
- ✅ Tool scripts are modularized
- ✅ Backup/build/log folders are ignored
- ✅ Security headers are configured

## 🔐 Security Notes

FlixCut includes:

- Content Security Policy
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer`
- Same-origin frame protection
- Restricted permissions policy
- File size and batch limits for browser stability
- Escaped file names in dynamic file lists

Security headers are configured for platforms that support `_headers` or `vercel.json`.

## 🌐 Deployment

Recommended platforms:

- Vercel
- Netlify
- Cloudflare Pages

For Vercel:

```bash
npm run build
```

Then deploy the project root. Vercel will use the included `vercel.json` headers.

## ⚠️ Limitations

- AI background removal depends on browser performance and model loading time.
- Very large files may be blocked to protect browser memory.
- Some advanced PDF operations depend on browser and device capability.
- Add Image to PDF is currently marked as coming soon.

## 👨‍💻 Author

Built by **Rishabh Pandey** as a polished browser-based image and PDF utility project.

## 📄 License

This project is currently maintained as a personal/portfolio project. Add a license before using it for public commercial distribution.
