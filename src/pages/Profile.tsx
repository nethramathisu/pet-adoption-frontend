import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const Profile = () =>
{
	const [formData, setFormData] =
		useState({
			name: "",
			email: "",
			phone: "",
			address: "",
			profilePic: "",
			password: "",
			role: "",
		});

	const [loading, setLoading] =
		useState(true);

	useEffect(() =>
	{
		const fetchProfile =
			async () =>
			{
				try
				{
					const res =
						await API.get(
							"/user/profile"
						);

					setFormData({
						name:
							res.data.name || "",
						email:
							res.data.email || "",
						phone:
							res.data.phone || "",
						address:
							res.data.address || "",
						profilePic:
							res.data.profilePic ||
							"",
						password: "",
						role:
							res.data.role || "",
					});
				}
				catch (err)
				{
					console.log(err);
				}
				finally
				{
					setLoading(false);
				}
			};

		fetchProfile();
	}, []);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement
		>
	) =>
	{
		setFormData({
			...formData,
			[e.target.name]:
				e.target.value,
		});
	};

	const handleSubmit =
		async () =>
		{
			try
			{
				await API.put(
					"/user/profile",
					{
						name:
							formData.name,
						email:
							formData.email,
						phone:
							formData.phone,
						address:
							formData.address,
						profilePic:
							formData.profilePic,
						password:
							formData.password,
					}
				);

				toast.success(
					"Profile updated successfully"
				);

			}
			catch (err)
			{
				console.log(err);

				toast.error(
					"Failed to update profile"
				);
			}
		};

	if (loading)
	{
		return (
			<div className="text-center mt-10">
				Loading...
			</div>
		);
	}

	return (
		<div className="max-w-3xl mx-auto">

			<div className="bg-white rounded-2xl shadow-xl p-8">

				<div className="flex flex-col items-center mb-8">

					<img
						src={
							formData.profilePic ||
							"https://via.placeholder.com/120"
						}
						alt=""
						className="w-28 h-28 rounded-full object-cover border-4 border-purple-400"
					/>

					<h1 className="text-3xl font-bold mt-4">
						My Profile
					</h1>

				</div>

				<div className="space-y-4">

					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={
							handleChange
						}
						placeholder="Name"
						className="w-full border p-3 rounded-xl"
					/>

					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={
							handleChange
						}
						placeholder="Email"
						className="w-full border p-3 rounded-xl"
					/>

					<input
						type="text"
						name="phone"
						value={formData.phone}
						onChange={
							handleChange
						}
						placeholder="Phone"
						className="w-full border p-3 rounded-xl"
					/>

					<input
						type="text"
						name="address"
						value={
							formData.address
						}
						onChange={
							handleChange
						}
						placeholder="Address"
						className="w-full border p-3 rounded-xl"
					/>

					<input
						type="text"
						name="profilePic"
						value={
							formData.profilePic
						}
						onChange={
							handleChange
						}
						placeholder="Profile Picture URL"
						className="w-full border p-3 rounded-xl"
					/>

					<input
						type="password"
						name="password"
						value={
							formData.password
						}
						onChange={
							handleChange
						}
						placeholder="New Password"
						className="w-full border p-3 rounded-xl"
					/>

					<input
						type="text"
						value={formData.role}
						disabled
						className="w-full border p-3 rounded-xl bg-gray-100"
					/>

					<button
						onClick={
							handleSubmit
						}
						className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl hover:opacity-90"
					>
						Update Profile
					</button>

				</div>

			</div>

		</div>
	);
};

export default Profile;