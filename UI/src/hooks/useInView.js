import { useEffect } from "react";

export function useInView(ref, options = {}) {
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      entry.target.classList.toggle("--animate", entry.isIntersecting);
    }, options);

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);
}
