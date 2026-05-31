import { useEffect } from 'react';

export default function LegacyToolRedirect({ src }) {
  useEffect(() => {
    window.location.replace(src);
  }, [src]);

  return null;
}
