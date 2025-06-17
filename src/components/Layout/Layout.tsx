import ChatSidebar from "@/components/ChatSidebar/ChatSidebar";
import ChatSidebarBackdrop from "@/components/ChatSidebarBackdrop/ChatSidebarBackdrop";
import ChatSidebarFloatingButtons from "@/components/ChatSidebarToggle/ChatSidebarFloatingButtons";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { createContext, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../Header/Header";
import WelcomeModal from "../WelcomeModal/WelcomeModal";

export const SidebarContext = createContext<{
  isOpen: boolean;
  onToggle: () => void;
}>({
  isOpen: false,
  onToggle: () => {},
});

const Layout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const dismissed = localStorage.getItem("welcomeModalDismissed");
    if (!dismissed) {
      setIsWelcomeOpen(true);
    }
  }, []);

  const closeWelcome = () => {
    setIsWelcomeOpen(false);
    localStorage.setItem("welcomeModalDismissed", "true");
  };

  const openWelcome = () => {
    setIsWelcomeOpen(true);
  };

  return (
    <ThemeProvider>
      <SidebarContext.Provider
        value={{ isOpen: isSidebarOpen, onToggle: toggleSidebar }}
      >
        <div className="z-10 flex flex-col bg-[var(--background-color)] min-h-screen text-[var(--text-color)] transition-colors duration-75">
          <Header onShowWelcome={openWelcome} />
          <div className="flex flex-col flex-1 mx-auto w-full">
            <ChatSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

            {!isSidebarOpen && (
              <ChatSidebarFloatingButtons onToggle={toggleSidebar} />
            )}
            {isSidebarOpen && <ChatSidebarBackdrop onClick={toggleSidebar} />}
            <Outlet />
          </div>
          <WelcomeModal isOpen={isWelcomeOpen} onClose={closeWelcome} />
        </div>
      </SidebarContext.Provider>
    </ThemeProvider>
  );
};

export default Layout;
