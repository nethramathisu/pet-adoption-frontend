import { Link } from "react-router-dom";
const Footer = () =>
{
	return (
		<footer className="bg-gray-900 text-white mt-12">

			<div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

				{/* Brand */}

				<div>
					<h2 className="text-2xl font-bold text-purple-400">
						🐾 PetAdopt
					</h2>

					<p className="mt-4 text-gray-400 leading-7">
						Connecting pets with caring families and helping
						shelters manage adoptions smoothly.
					</p>
				</div>

				{/* Navigation */}

				{/* Navigation */}
				<div>
					<h3 className="font-semibold text-lg mb-4">Quick Links</h3>

					<div className="space-y-2 text-gray-400">
						<Link to="/" className="hover:text-white block">
							Home
						</Link>

						<Link to="/favorites" className="hover:text-white block">
							Favorites
						</Link>

						<Link to="/my-applications" className="hover:text-white block">
							Applications
						</Link>

						<Link to="/my-meetings" className="hover:text-white block">
							My Meetings
						</Link>
					</div>
				</div>
				{/* Features */}

				<div>
					<h3 className="font-semibold text-lg mb-4">
						Features
					</h3>

					<div className="space-y-2 text-gray-400">

						<p>Pet Adoption</p>
						<p>Chat System</p>
						<p>Meetings</p>
						<p>Reviews</p>
						<p>Foster Care</p>

					</div>
				</div>

				{/* Contact */}

				<div>
					<h3 className="font-semibold text-lg mb-4">
						Contact
					</h3>

					<div className="space-y-2 text-gray-400">

						<p>📧 support@petadopt.com</p>

						<p>📞 +91 9876543210</p>

						<p>📍 Chennai, India</p>

					</div>
				</div>

			</div>

			<div className="border-t border-gray-700 py-4 text-center text-gray-400">

				© {new Date().getFullYear()} PetAdopt • Built with MERN Stack

			</div>

		</footer>
	);
};

export default Footer;