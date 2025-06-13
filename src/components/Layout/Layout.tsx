import { Outlet, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import "@/assets/styles/theme.scss";
import "./Layout.scss";
import { ChatSidebar } from "@/features/chat/components/ChatSidebar/ChatSidebar";
import { createContext, useState } from "react";
import { ChatSidebarToggle } from "@/features/chat/components/ChatSidebarToggle/ChatSidebarToggle";
import { ChatSidebarBackdrop } from "@/features/chat/components/ChatSidebarBackdrop/ChatSidebarBackdrop";

export const SidebarContext = createContext<{
  isOpen: boolean;
  onToggle: () => void;
}>({
  isOpen: false,
  onToggle: () => {},
});

export const Layout = () => {
  const location = useLocation();
  const showFooter = !location.pathname.includes("/chat");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <ThemeProvider>
      <SidebarContext.Provider
        value={{ isOpen: isSidebarOpen, onToggle: toggleSidebar }}
      >
        <div className={`layout ${!showFooter ? "no-footer" : ""}`}>
          <Header />
          <main className="main">
            <ChatSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

            {!isSidebarOpen && <ChatSidebarToggle onClick={toggleSidebar} />}
            {isSidebarOpen && <ChatSidebarBackdrop onClick={toggleSidebar} />}
            <Outlet />
          </main>
          {showFooter && <Footer />}
        </div>
      </SidebarContext.Provider>
    </ThemeProvider>
  );
};
