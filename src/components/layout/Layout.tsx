import { Outlet, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'src/context/ThemeContext';
import { Header } from './header/Header';
import { Footer } from './footer/Footer';
import 'src/assets/styles/theme.scss';
import './Layout.scss';

export const Layout = () => {
  const location = useLocation();
  const showFooter = location.pathname !== '/chat';

  return (
    <ThemeProvider>
      <div className={`layout ${!showFooter ? 'no-footer' : ''}`}>
        <Header />
        <main className="main">
          <Outlet />
        </main>
        {showFooter && <Footer />}
      </div>
    </ThemeProvider>
  );
}; 