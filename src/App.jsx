import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import BgRemover from './features/bg-remover/BgRemover.jsx';
import MergePdf from './features/merge-pdf/MergePdf.jsx';
import FileConverter from './features/file-converter/FileConverter.jsx';
import ImageCompressor from './features/image-compressor/ImageCompressor.jsx';
import CompressPdf from './features/compress-pdf/CompressPdf.jsx';
import ScanToPdf from './features/scan-to-pdf/ScanToPdf.jsx';
import AddImagePdf from './features/add-image-pdf/AddImagePdf.jsx';

const routes = {
  '/': Home,
  '/index.html': Home,
  '/tools/bg-remover': BgRemover,
  '/tools/bg-remover.html': BgRemover,
  '/tools/merge-pdf': MergePdf,
  '/tools/merge-pdf.html': MergePdf,
  '/tools/file-converter': FileConverter,
  '/tools/file-converter.html': FileConverter,
  '/tools/image-compressor': ImageCompressor,
  '/tools/image-compress': ImageCompressor,
  '/tools/image-compress.html': ImageCompressor,
  '/tools/compress-pdf': CompressPdf,
  '/tools/compress-pdf.html': CompressPdf,
  '/tools/scan-to-pdf': ScanToPdf,
  '/tools/scan-to-pdf.html': ScanToPdf,
  '/tools/add-image-pdf': AddImagePdf,
  '/tools/add-image-pdf.html': AddImagePdf,
};

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const Page = routes[path] || NotFound;

  return <Page />;
}
