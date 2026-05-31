export default function ToolCard({ tool }) {
  return (
    <article className={`tool-card tool-card-${tool.accent}`}>
      <a href={tool.route} className="tool-card-link">
        <span className="tool-card-icon">
          <span className="material-symbols-outlined">{tool.icon}</span>
        </span>
        <span className="tool-card-copy">
          <strong>{tool.name}</strong>
          <span>{tool.description}</span>
        </span>
        <span className="tool-card-arrow">
          <span className="material-symbols-outlined">arrow_forward</span>
        </span>
      </a>
    </article>
  );
}
