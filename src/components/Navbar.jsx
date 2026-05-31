import { tools } from '../constants/tools.js';

export default function Navbar() {
  return (
    <header className="navbar">
      <a className="brand" href="/" aria-label="PixCut home">
        <span className="brand-icon">
          <span className="material-symbols-outlined">bolt</span>
        </span>
        <span className="brand-text">PixCut</span>
      </a>

      <nav className="nav-links" aria-label="Main navigation">
        {tools.slice(0, 5).map((tool) => (
          <a key={tool.id} href={tool.route}>
            {tool.shortName}
          </a>
        ))}
      </nav>
    </header>
  );
}
