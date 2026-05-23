import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () =>
{
	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50">

			<Navbar />

			<main className="flex-grow">
				<Outlet />
			</main>

			<Footer />

		</div>
	);
};

export default MainLayout;