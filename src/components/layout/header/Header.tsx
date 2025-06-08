import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'src/context/AuthContext';
import { ReactComponent as Logo } from 'src/assets/icons/logo.svg';
import { ReactComponent as UserIcon } from 'src/assets/icons/user.svg';
import { ReactComponent as LogoutIcon } from 'src/assets/icons/logout.svg';
import { LoginModal } from 'src/features/auth';
import { DropdownMenu, DropdownMenuItem } from 'src/components/ui-kit/DropdownMenu';
import './Header.scss';

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const userName = user ? `${user.first_name} ${user.last_name}` : '';
  const hasProfileImage = user?.profile_image_url && user.profile_image_url.trim() !== '';

  const userMenuItems: DropdownMenuItem[] = [
    {
      id: 'logout',
      label: 'Logout',
      icon: <LogoutIcon />,
      onClick: logout,
    }
  ];

  const userTrigger = (
    <button className="header__user-button" title={userName}>
      {hasProfileImage ? (
        <img 
          src={user!.profile_image_url} 
          alt={userName} 
          className="header__user-profile-img" 
        />
      ) : (
        <UserIcon className="header__user-icon" />
      )}
    </button>
  );

  return (
    <header className="header">
      <div className="header__content">
        <Link to="/" className="header__logo-link">
          <div className="header__logo">
            <Logo className="header__logo-img" aria-label="Agg AI Logo" />
            <span className="header__logo-text">AI Aggregator</span>
          </div>
        </Link>
        <div className="header__actions">
          {isAuthenticated ? (
            <div className="header__user">
              <DropdownMenu 
                trigger={userTrigger}
                items={userMenuItems}
                position="left"
                className="header__user-dropdown"
              />
            </div>
          ) : (
            <button className="header__login-btn" onClick={openLoginModal}>
              Login
            </button>
          )}
        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </header>
  );
}; 