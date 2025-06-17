import { Outlet, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ChatSidebar from "@/components/ChatSidebar/ChatSidebar";
import { createContext, useState } from "react";
import ChatSidebarFloatingButtons from "@/components/ChatSidebarToggle/ChatSidebarFloatingButtons";
import ChatSidebarBackdrop from "@/components/ChatSidebarBackdrop/ChatSidebarBackdrop";
import Header from "../Header/Header";

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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <ThemeProvider>
      <SidebarContext.Provider
        value={{ isOpen: isSidebarOpen, onToggle: toggleSidebar }}
      >
        <div className="z-10 flex flex-col bg-[var(--background-color)] min-h-screen text-[var(--text-color)] transition-colors duration-75">
          <Header />
          <div className="flex flex-col flex-1 mx-auto w-full">
            <ChatSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

            {!isSidebarOpen && (
              <ChatSidebarFloatingButtons onToggle={toggleSidebar} />
            )}
            {isSidebarOpen && <ChatSidebarBackdrop onClick={toggleSidebar} />}
            <Outlet />
          </div>
        </div>
      </SidebarContext.Provider>
    </ThemeProvider>
  );
};

export default Layout;
