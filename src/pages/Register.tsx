import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Register = () =>
{
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		role: "Adopter",
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) =>
	{
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) =>
	{
		e.preventDefault();
		try
		{
			await API.post("/api/auth/register", formData);
			toast.success("Registered successfully!");
		} catch (error: any)
		{
			toast.error(error.response?.data?.message);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">

			<div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">

				<h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
					Create Account 🐾
				</h2>

				<form onSubmit={handleSubmit} className="space-y-4">

					<input
						name="name"
						placeholder="Full Name"
						onChange={handleChange}
						className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
					/>

					<input
						name="email"
						type="email"
						placeholder="Email"
						onChange={handleChange}
						className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
					/>

					<input
						name="password"
						type="password"
						placeholder="Password"
						onChange={handleChange}
						className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
					/>

					<select
						name="role"
						onChange={handleChange}
						className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
					>
						<option value="Adopter">Adopter</option>
						<option value="Shelter">Shelter</option>
						<option value="Foster">Foster</option>
					</select>

					<button
						className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
					>
						Register
					</button>

				</form>
				<p className="text-center mt-4 text-sm">
  Already have an account?{" "}
  <Link
    to="/login"
    className="text-blue-600 font-semibold"
  >
    Login
  </Link>
</p>
				<p className="mt-4 text-center text-sm">
					Back to{" "}
					<Link to="/" className="text-blue-600 font-semibold">
						Home
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Register;