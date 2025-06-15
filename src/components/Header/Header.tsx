import LogoutIcon from "@/assets/icons/logout.svg?react";
import UserIcon from "@/assets/icons/user.svg?react";
import DropdownMenu, {
  type DropdownMenuItem,
} from "@/components/DropdownMenu/DropdownMenu";
import LoginModal from "@/components/LoginModal/LoginModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useMinimumLoading } from "@/hooks/useMinimumLoading";
import { Settings } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

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
    <Button
      variant="text"
      size="icon"
      title={userName}
      className="rounded-full"
    >
      {hasProfileImage ? (
        <img
          src={user.profile_image_url || undefined}
          alt={userName}
          className="border border-[var(--border-color)] rounded-full w-6 h-6 object-cover"
        />
      ) : (
        <UserIcon className="w-5 h-5" />
      )}
    </Button>
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
      <Button onClick={openLoginModal} size="sm" className="text-xs">
        Login
      </Button>
    );
  };

  return (
    <>
      {/* Top Right Section - Controls */}
      <div className="top-3 right-3 z-[100] fixed rounded-xl">
        <div className="flex items-center gap-1">{renderUserContent()}</div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  );
};

export default Header;
