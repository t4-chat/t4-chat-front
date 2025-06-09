import { Outlet, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { Header } from "./header/Header";
import { Footer } from "./footer/Footer";
import "@/assets/styles/theme.scss";
import "./Layout.scss";

export const Layout = () => {
	const location = useLocation();
	const showFooter = location.pathname !== "/chat";

	return (
		<ThemeProvider>
			<div
				className={`layout flex-col bg-red flex ${!showFooter ? "no-footer" : ""}`}
			>
				<Header />
				<main className="main">
					<Outlet />
				</main>
				{showFooter && <Footer />}
			</div>
		</ThemeProvider>
	);
};
