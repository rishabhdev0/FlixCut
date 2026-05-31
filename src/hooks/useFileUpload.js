import { useState } from 'react';

export function useFileUpload(initialFiles = []) {
  const [files, setFiles] = useState(initialFiles);

  function addFiles(nextFiles) {
    setFiles((currentFiles) => [...currentFiles, ...Array.from(nextFiles)]);
  }

  function clearFiles() {
    setFiles([]);
  }

  function removeFile(indexToRemove) {
    setFiles((currentFiles) => currentFiles.filter((_, index) => index !== indexToRemove));
  }

  return { files, addFiles, clearFiles, removeFile, setFiles };
}
