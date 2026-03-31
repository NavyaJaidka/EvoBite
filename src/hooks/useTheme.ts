import { useState, useEffect } from "react";

export const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("evobite-theme");
    if (saved) return saved === "dark";
    return true; // default dark
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("evobite-theme", isDark ? "dark" : "light");
  }, [isDark]);

  return { isDark, toggle: () => setIsDark((p) => !p) };
};
