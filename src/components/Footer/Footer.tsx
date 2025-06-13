import { useTheme, type ThemeType } from "@/context/ThemeContext";
import "./Footer.scss";
import { cn } from "@/lib/utils";
import { useContext } from "react";
import { SidebarContext } from "../Layout/Layout";

export const Footer = () => {
  const { currentTheme, setTheme } = useTheme();

  const handleThemeChange = () => {
    const nextTheme: ThemeType = currentTheme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  };

  // Get the appropriate icon for the current theme
  const getThemeIcon = (theme: ThemeType) => {
    switch (theme) {
      case "light":
        return "🌙"; // Show moon icon to switch to dark
      case "dark":
        return "☀️"; // Show sun icon to switch to light
      default:
        return "⚙️";
    }
  };
  const { isOpen: isSidebarOpen } = useContext(SidebarContext);
  return (
    <footer className={cn("footer", { "with-sidebar": isSidebarOpen })}>
      <div className="footer__content">
        <p className="footer__copyright">
          &copy; 2025 T4 Chat. All rights reserved.
        </p>
        <button
          type="button"
          className="footer__theme-toggle"
          onClick={handleThemeChange}
          aria-label={`Switch to ${currentTheme === "light" ? "dark" : "light"} theme`}
          title={`Current: ${currentTheme}. Click to switch theme`}
        >
          {getThemeIcon(currentTheme)}
        </button>
      </div>
    </footer>
  );
};
