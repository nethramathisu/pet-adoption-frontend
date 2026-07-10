import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Register = () =>
{
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
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

		const name = formData.name.trim();
		const email = formData.email.trim().toLowerCase();
		const password = formData.password.trim();

		// Name validation
		if (!name)
		{
			toast.error("Full name is required");
			return;
		}

		if (name.length < 3)
		{
			toast.error("Name must be at least 3 characters");
			return;
		}

		if (!/^[A-Za-z ]+$/.test(name))
		{
			toast.error("Name can contain only letters and spaces");
			return;
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(email))
		{
			toast.error("Please enter a valid email address");
			return;
		}

		// Password validation
		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

		if (!passwordRegex.test(password))
		{
			toast.error(
				"Password must be at least 8 characters and include one uppercase letter, one lowercase letter and one number."
			);
			return;
		}

		try
		{
			setLoading(true);

			await API.post("/api/auth/register", {
				name,
				email,
				password,
				role: formData.role,
			});

			toast.success("Registered successfully!");

			setFormData({
				name: "",
				email: "",
				password: "",
				role: "Adopter",
			});

			navigate("/login");
		} catch (error: any)
		{
			toast.error(
				error.response?.data?.message || "Registration failed"
			);
		} finally
		{
			setLoading(false);
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
						value={formData.name}
						onChange={handleChange}
						placeholder="Full Name"
						autoComplete="name"
						className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
					/>

					<input
						name="email"
						type="email"
						value={formData.email}
						onChange={handleChange}
						placeholder="Email"
						autoComplete="email"
						className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
					/>

					<input
						name="password"
						type="password"
						value={formData.password}
						onChange={handleChange}
						placeholder="Password"
						autoComplete="new-password"
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
						type="submit"
						disabled={loading}
						className={`w-full text-white font-semibold py-3 rounded-lg transition ${loading
								? "bg-gray-400 cursor-not-allowed"
								: "bg-purple-600 hover:bg-purple-700"
							}`}
					>
						{loading ? "Registering..." : "Register"}
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