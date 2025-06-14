import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme, type ThemeType } from "@/context/ThemeContext";
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
      icon: <LogoutIcon width={16} height={16} />,
      onClick: logout,
    },
  ];

  const userTrigger = (
    <button
      className="flex justify-center items-center bg-transparent hover:bg-[var(--hover-color)] p-1 border-none rounded-full transition-colors duration-100 cursor-pointer"
      title={userName}
      type="button"
    >
      {hasProfileImage ? (
        <img
          src={user.profile_image_url || undefined}
          alt={userName}
          className="border border-[var(--border-color)] rounded-full w-6 h-6 object-cover"
        />
      ) : (
        <UserIcon className="w-5 h-5 text-[var(--text-color)]" />
      )}
    </button>
  );
  const { isMinimumLoading } = useMinimumLoading({
    initialLoading: isLoading,
  });

  const renderUserContent = () => {
    if (isMinimumLoading) {
      return null;
    }
    if (isAuthenticated) {
      return (
        <DropdownMenu
          trigger={userTrigger}
          items={userMenuItems}
          position="left"
          className="[&_.dropdown-menu]:mt-2 [&_.dropdown-menu-icon_svg]:w-4 [&_.dropdown-menu]:min-w-[120px] [&_.dropdown-menu-icon_svg]:h-4"
        />
      );
    }
    return (
      <button
        className="bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] px-3 py-1 border-none rounded text-white text-xs transition-colors duration-100 cursor-pointer"
        onClick={openLoginModal}
        type="button"
      >
        Login
      </button>
    );
  };

  return (
    <>
      {/* Top Right Section - Controls */}
      <div className="top-4 right-4 z-[100] fixed bg-[var(--background-color)]/95 shadow-black/5 shadow-lg backdrop-blur-sm px-2 py-2 border border-[var(--border-color)]/50 rounded-xl">
        <div className="flex items-center gap-1.5">
          {renderUserContent()}
          <button
            type="button"
            className="flex justify-center items-center bg-transparent hover:bg-[var(--hover-color)] focus:bg-[var(--hover-color)] p-1.5 border-none rounded-lg focus:outline-none text-base transition-colors duration-100 cursor-pointer"
            onClick={handleThemeChange}
            aria-label={`Switch to ${currentTheme === "light" ? "dark" : "light"} theme`}
            title={`Current: ${currentTheme}. Click to switch theme`}
          >
            {getThemeIcon(currentTheme)}
          </button>
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  );
};
