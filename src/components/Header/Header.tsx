import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme, type ThemeType } from "@/context/ThemeContext";
import Logo from "@/assets/icons/logo.png";
import UserIcon from "@/assets/icons/user.svg?react";
import LogoutIcon from "@/assets/icons/logout.svg?react";
import { Shield, Settings } from "lucide-react";
import { LoginModal } from "@/components/LoginModal/LoginModal";
import {
  DropdownMenu,
  type DropdownMenuItem,
} from "@/components/DropdownMenu/DropdownMenu";
import { useMinimumLoading } from "@/hooks/useMinimumLoading";

export const Header = () => {
  const { isAuthenticated, user, logout, isLoading, isAdmin } = useAuth();
  const { currentTheme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

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

  const userName = user ? `${user.first_name} ${user.last_name}` : "";
  const hasProfileImage =
    user?.profile_image_url && user.profile_image_url.trim() !== "";

  const userMenuItems: DropdownMenuItem[] = [
    {
      id: "settings",
      label: "Settings",
      icon: <Settings size={16} />,
      onClick: () => navigate("/settings"),
    },

    {
      id: "logout",
      label: "Logout",
      icon: <LogoutIcon />,
      onClick: logout,
    },
  ];

  const userTrigger = (
    <button
      className="flex justify-center items-center bg-transparent hover:bg-[var(--hover-color)] p-1 border-none rounded-full transition-colors duration-200 cursor-pointer"
      title={userName}
      type="button"
    >
      {hasProfileImage ? (
        <img
          src={user.profile_image_url || undefined}
          alt={userName}
          className="border border-[var(--border-color)] rounded-full w-8 h-8 object-cover"
        />
      ) : (
        <UserIcon className="w-7 h-7 text-[var(--text-color)]" />
      )}
    </button>
  );
  const { isMinimumLoading } = useMinimumLoading({
    initialLoading: isLoading,
  });

  const renderLoginButtonContent = () => {
    if (isMinimumLoading) {
      return (
        <div className="flex justify-center items-center h-10">Loading...</div>
      );
    }
    if (isAuthenticated) {
      return (
        <div className="flex items-center">
          <DropdownMenu
            trigger={userTrigger}
            items={userMenuItems}
            position="left"
            className="[&_.dropdown-menu]:mt-2 [&_.dropdown-menu-icon_svg]:w-5 [&_.dropdown-menu]:min-w-[150px] [&_.dropdown-menu-icon_svg]:h-5"
          />
        </div>
      );
    }
    return (
      <button
        className="bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] px-6 sm:px-4 py-2 sm:py-1 border-none rounded-md font-medium text-white transition-colors duration-200 cursor-pointer"
        onClick={openLoginModal}
        type="button"
      >
        Login
      </button>
    );
  };
  return (
    <header className="top-0 z-[100] sticky bg-[var(--background-color)] border-[var(--border-color)] border-b w-full transition-colors duration-300">
      <div className="flex justify-between items-center mx-auto px-6 sm:px-4 py-4 sm:py-2 max-w-[1200px]">
        <Link
          to="/"
          className="flex hover:opacity-80 focus:opacity-80 focus:outline-none text-inherit no-underline transition-opacity duration-200"
        >
          <div className="flex items-center gap-2">
            <img src={Logo} alt="T4 Chat Logo" className="w-auto h-8 sm:h-6" />
            <span className="font-bold text-[var(--text-color)] sm:text-lg text-xl">
              T4 Chat{" "}
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex justify-center items-center bg-transparent hover:bg-[var(--hover-color)] focus:bg-[var(--hover-color)] p-1 border-none rounded-sm focus:outline-none text-lg transition-colors duration-200 cursor-pointer"
            onClick={handleThemeChange}
            aria-label={`Switch to ${currentTheme === "light" ? "dark" : "light"} theme`}
            title={`Current: ${currentTheme}. Click to switch theme`}
          >
            {getThemeIcon(currentTheme)}
          </button>
          {renderLoginButtonContent()}
        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </header>
  );
};
