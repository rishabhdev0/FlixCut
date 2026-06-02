import { useEffect } from 'react';

export default function LegacyToolPage({ src }) {
  useEffect(() => {
    window.location.assign(src);
  }, [src]);

  return null;
}
