import { Outlet, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { Header } from "@/components/Header/Header";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <ThemeProvider>
      <SidebarContext.Provider
        value={{ isOpen: isSidebarOpen, onToggle: toggleSidebar }}
      >
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex flex-col grow">
            <ChatSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

            {!isSidebarOpen && <ChatSidebarToggle onClick={toggleSidebar} />}
            {isSidebarOpen && <ChatSidebarBackdrop onClick={toggleSidebar} />}
            <Outlet />
          </div>
        </div>
      </SidebarContext.Provider>
    </ThemeProvider>
  );
};
