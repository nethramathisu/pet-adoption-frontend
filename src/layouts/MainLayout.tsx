import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () =>
{
	return (
		<div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50">

			<Navbar />

			<main className="flex-1 px-6 pt-10 pb-6">
				<Outlet />
			</main>

			<Footer />

		</div>
	);
};

export default MainLayout;