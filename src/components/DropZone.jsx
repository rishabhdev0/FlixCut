export default function DropZone({
  accept,
  multiple = false,
  title = 'Drop files here',
  subtitle = 'or click to browse',
  onFiles,
}) {
  function handleFiles(fileList) {
    const files = Array.from(fileList || []);
    if (files.length) onFiles?.(files);
  }

  return (
    <label
      className="drop-zone"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        handleFiles(event.dataTransfer.files);
      }}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(event) => handleFiles(event.target.files)}
      />
      <span className="drop-zone-icon">
        <span className="material-symbols-outlined">upload_file</span>
      </span>
      <strong>{title}</strong>
      <span>{subtitle}</span>
    </label>
  );
}
