# PixCut Manual Testing Checklist

Use this file before pushing a release. Test on Desktop Chrome, Mobile Chrome, and Edge.

## Global Checks

- Open the home page and confirm the navbar, support button, logo, tool cards, and footer render correctly.
- Open every tool from the home page.
- Refresh while inside each tool and confirm it stays on that tool.
- Use browser back/forward between home and tools.
- Open each tool once online, then turn internet off and confirm cached pages still load.
- Confirm horizontal scrolling does not appear on desktop, tablet, or mobile.
- Confirm right-side settings panels scroll inside their own column on desktop.
- Confirm mobile layout stacks upload, queue, settings, and privacy bar cleanly.
- Drag a random file outside the drop zone and confirm the browser does not navigate away.
- Select the same file twice after clearing and confirm the second selection is accepted.
- Try unsupported file types and confirm a clear error/toast appears.
- Try empty actions: convert/download/merge/compress/generate without files and confirm the UI does not crash.

## Background Remover

- Upload JPG, PNG, and large image files.
- Confirm image is visible and centered on desktop and mobile.
- Test zoom in, zoom out, fit, and 1:1.
- Test Result, Original, Mask tabs.
- Test Magic Wand selection.
- Test brush erase/restore.
- Test mask grow, shrink, smooth, feather, refine, and invert.
- Test background swatches and custom background image.
- Test brightness, contrast, saturation, sharpness, opacity, canvas size, and text overlay.
- Test undo/redo/history controls.
- Test compare slider on desktop and mobile.
- Test PNG download, size dropdown, copy, and new image.
- Test AI removal online with API configured.
- Test AI removal failure state with internet/API unavailable.

## File Converter

- Upload JPG, PNG, WebP, BMP, and GIF images.
- Convert image to image formats.
- Convert images to PDF.
- Convert PDF pages to images.
- Test quality, resize, filters, watermark, batch rename, ZIP download, and clear.
- Test duplicate files and large files.
- Confirm file queue aligns with upload area and settings panel.

## Merge PDF

- Upload multiple PDFs.
- Upload image files mixed with PDFs.
- Reorder files, sort A-Z, sort by size, and sort by type.
- Set page ranges and rotations.
- Test page size, orientation, margins, blank-page option, compression, password protection, and metadata.
- Merge and download.
- Test clear/reset and empty merge action.

## Image Compressor

- Upload JPG, PNG, WebP, BMP, and GIF where supported.
- Test target presets and custom target size.
- Test exact target and stay-under modes.
- Test output format, quality, resize, EXIF stripping, download, ZIP, and clear.
- Confirm summary updates before and after compression.

## Compress PDF

- Upload one PDF and multiple PDFs.
- Test all compression levels and confirm selected level is visually obvious.
- Test metadata stripping, image recompression, object streams, password encryption, and output download.
- Test reset/clear and empty compression action.

## Scan To PDF

- Upload photos.
- Use camera capture on mobile.
- Crop immediately after camera capture.
- Add more pages, reorder/delete pages, and preview pages.
- Test scan filters, brightness, contrast, sharpness, page size, orientation, quality, page numbers, and output name.
- Generate and download PDF.
- Test camera permission denied and switch back to upload.

## Add Image To PDF

- Confirm the page clearly shows Coming Soon.
- Confirm it does not expose broken controls.

## Large File Checks

- Test near-limit files for every tool.
- Confirm rejected files show a clear toast.
- Confirm large successful files do not freeze the UI permanently.
- Confirm cancel/retry flows still work after a failure.

## Release Notes

- Record browser/device tested.
- Record any known limitation before pushing.
- Do not claim AI removal works offline when using the remove.bg API.
