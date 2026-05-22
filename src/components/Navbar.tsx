import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () =>
{
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () =>
	{
		logout();
		navigate("/login");
	};

	return (
		<nav className="sticky top-0 z-50 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 shadow-lg">

			<div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

				{/* LOGO */}
				<Link
					to="/"
					className="text-3xl font-extrabold text-white tracking-wide hover:scale-110 transition"
				>
					🐾 PetAdopt
				</Link>

				{/* LINKS */}
				<div className="flex items-center gap-3 flex-wrap">

					{/* ================= PUBLIC (NOT LOGGED IN) ================= */}
					{!user && (
						<>
							<Link
								to="/"
								className="bg-white/20 text-white px-4 py-2 rounded-full hover:bg-white hover:text-purple-600 transition"
							>
								🏠 Home
							</Link>

							<Link
								to="/login"
								className="bg-white/20 text-white px-4 py-2 rounded-full hover:bg-white hover:text-blue-600 transition"
							>
								🔐 Login
							</Link>

							<Link
								to="/register"
								className="bg-white/20 text-white px-4 py-2 rounded-full hover:bg-white hover:text-green-600 transition"
							>
								📝 Register
							</Link>
						</>
					)}

					{/* ================= ADOPTER ================= */}
					{user?.role === "Adopter" && (
						<>
							<Link to="/" className="nav-btn">🏠 Home</Link>

							<Link to="/app/favorites" className="nav-btn">
								❤️ Favorites
							</Link>

							<Link to="/app/my-applications" className="nav-btn">
								📄 Applications
							</Link>

							<Link to="/app/my-meetings" className="nav-btn">
								📅 Meetings
							</Link>

							<Link to="/app/inbox" className="nav-btn">💬 Messages</Link>
						</>
					)}

					{/* ================= SHELTER ================= */}
					{user?.role === "Shelter" && (
						<>
							<Link to="/shelter" className="nav-btn">📊 Dashboard</Link>
							<Link to="/shelter/pets" className="nav-btn">🐶 My Pets</Link>
							<Link to="/shelter/applications" className="nav-btn">📄 Applications</Link>
							<Link to="/shelter/meetings" className="nav-btn">📅 Meetings</Link>
							<Link to="/app/inbox" className="nav-btn">💬 Messages</Link>
							<Link to={`/app/reviews/shelter/${user._id}`} className="nav-btn">⭐ Reviews</Link>
						</>
					)}

					{/* ================= FOSTER ================= */}
					{user?.role === "Foster" && (
						<>
							<Link to="/foster" className="nav-btn">🐾 My Foster Pets</Link>
							<Link to="/app/inbox" className="nav-btn">💬 Messages</Link>
						</>
					)}

					{/* ================= COMMON ================= */}
					{user && (
						<Link to="/app/profile" className="nav-btn">
							👤 Profile
						</Link>
					)}

					{/* ROLE BADGE */}
					{user && (
						<div className="bg-yellow-300 text-black font-semibold px-3 py-2 rounded-full">
							{user.role}
						</div>
					)}

					{/* LOGOUT */}
					{user && (
						<button
							onClick={handleLogout}
							className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
						>
							Logout
						</button>
					)}

				</div>
			</div>
		</nav>
	);
};

export default Navbar;