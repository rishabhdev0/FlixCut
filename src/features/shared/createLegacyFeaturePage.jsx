import LegacyToolPage from './LegacyToolPage.jsx';
import { getToolById } from '../../constants/tools.js';

export function createLegacyFeaturePage(toolId) {
  return function LegacyFeaturePage() {
    const tool = getToolById(toolId);
    return <LegacyToolPage src={tool.legacyPath} />;
  };
}
