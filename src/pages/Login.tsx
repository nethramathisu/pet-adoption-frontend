import { useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
const Login = () =>
{
	const navigate = useNavigate();

	const { login } = useAuth();

	const [loading, setLoading] =
		useState(false);

	const [formData, setFormData] =
		useState({
			email: "",
			password: "",
		});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) =>
	{
		setFormData({
			...formData,
			[e.target.name]:
				e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) =>
	{
		e.preventDefault();

		// Trim inputs
		const email = formData.email.trim().toLowerCase();
		const password = formData.password.trim();

		// Email validation
		if (!email)
		{
			toast.error("Email is required");
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(email))
		{
			toast.error("Please enter a valid email address");
			return;
		}

		// Password validation
		if (!password)
		{
			toast.error("Password is required");
			return;
		}

		if (password.length < 6)
		{
			toast.error("Password must be at least 6 characters");
			return;
		}

		try
		{
			setLoading(true);

			const res = await API.post("/api/auth/login", {
				email,
				password,
			});

			console.log("LOGIN RESPONSE:", res.data);

			const token = res.data.token;

			const user = {
				_id: res.data._id,
				name: res.data.name,
				email: res.data.email,
				role: res.data.role,
			};

			login(user, token);

			if (user.role === "Shelter")
			{
				navigate("/shelter");
			} else if (user.role === "Foster")
			{
				navigate("/foster");
			} else
			{
				navigate("/");
			}

		} catch (error: any)
		{
			toast.error(
				error.response?.data?.message || "Login failed"
			);
		} finally
		{
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4">

			<div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8">

				{/* HEADER */}
				<div className="text-center mb-8">

					<h1 className="text-4xl font-bold text-gray-800">
						Welcome Back 👋
					</h1>

					<p className="text-gray-500 mt-2">
						Login to continue
					</p>

				</div>

				{/* FORM */}
				<form
					onSubmit={handleSubmit}
					className="space-y-5"
				>

					{/* EMAIL */}
					<div>

						<label className="block text-sm font-medium text-gray-700 mb-1">
							Email
						</label>

						<input
							type="email"
							name="email"
							placeholder="Enter your email"
							value={formData.email}
							onChange={handleChange}
							autoComplete="email"
							className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
						/>

					</div>

					{/* PASSWORD */}
					<div>

						<label className="block text-sm font-medium text-gray-700 mb-1">
							Password
						</label>

						<input
							type="password"
							name="password"
							placeholder="Enter your password"
							value={formData.password}
							onChange={handleChange}
							autoComplete="current-password"
							className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
						/>

					</div>

					{/* BUTTON */}
					<button
						type="submit"
						disabled={loading}
						className={`w-full text-white font-semibold py-3 rounded-xl transition duration-200 ${loading
								? "bg-gray-400 cursor-not-allowed"
								: "bg-purple-600 hover:bg-purple-700"
							}`}
					>
						{loading ? "Logging in..." : "Login"}
					</button>	

				</form>

				{/* FOOTER */}
				<p className="text-center text-gray-500 mt-6">

					Don’t have an account?{" "}

					<Link
						to="/register"
						className="text-purple-600 font-semibold hover:underline"
					>
						Register
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

export default Login;