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
import "./Header.scss";
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
    <button className="header__user-button" title={userName} type="button">
      {hasProfileImage ? (
        <img
          src={user.profile_image_url || undefined}
          alt={userName}
          className="header__user-profile-img"
        />
      ) : (
        <UserIcon className="header__user-icon" />
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
        <div className="header__user">
          <DropdownMenu
            trigger={userTrigger}
            items={userMenuItems}
            position="left"
            className="header__user-dropdown"
          />
        </div>
      );
    }
    return (
      <button
        className="header__login-btn"
        onClick={openLoginModal}
        type="button"
      >
        Login
      </button>
    );
  };
  return (
    <header className="header">
      <div className="header__content">
        <Link to="/" className="header__logo-link">
          <div className="header__logo">
            <img src={Logo} alt="T4 Chat Logo" className="header__logo-img" />
            <span className="header__logo-text">T4 Chat </span>
          </div>
        </Link>
        <div className="header__actions">
          <button
            type="button"
            className="header__theme-toggle"
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
