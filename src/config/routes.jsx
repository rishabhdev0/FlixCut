import Home from '../pages/Home.jsx';
import NotFound from '../pages/NotFound.jsx';
import BgRemover from '../features/bg-remover/BgRemover.jsx';
import MergePdf from '../features/merge-pdf/MergePdf.jsx';
import FileConverter from '../features/file-converter/FileConverter.jsx';
import ImageCompressor from '../features/image-compressor/ImageCompressor.jsx';
import CompressPdf from '../features/compress-pdf/CompressPdf.jsx';
import ScanToPdf from '../features/scan-to-pdf/ScanToPdf.jsx';
import AddImagePdf from '../features/add-image-pdf/AddImagePdf.jsx';
import { tools } from '../constants/tools.js';

const routeComponents = {
  'bg-remover': BgRemover,
  'merge-pdf': MergePdf,
  'file-converter': FileConverter,
  'image-compressor': ImageCompressor,
  'compress-pdf': CompressPdf,
  'scan-to-pdf': ScanToPdf,
  'add-image-pdf': AddImagePdf,
};

export const routes = [
  { path: '/', component: Home },
  { path: '/index.html', component: Home },
  ...tools.flatMap((tool) => {
    const component = routeComponents[tool.id];
    const aliases = [tool.route, tool.legacyPath, ...(tool.aliases || [])];
    return aliases.map((path) => ({ path, component }));
  }),
];

export const fallbackRoute = NotFound;
