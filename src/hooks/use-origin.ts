import { useEffect, useState } from "react";

// create a custom hook to safely access the window object
// in server side rendering the window object does not exist
// the window object is only available on the client side (on the browser)
export function useOrigin() {
  // make sure no hydaration errors
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return "";

  // if window object is available , if it is, if window.location.origin exists return it
  // otherwise return ""
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  return origin;
}
