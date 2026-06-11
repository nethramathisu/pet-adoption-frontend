import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const uploadToCloudinary = async (file: File): Promise<string> => {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

	const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

	const res = await fetch(url, { method: "POST", body: formData });
	const data = await res.json();

	if (!data.secure_url) throw new Error("Image upload failed");
	return data.secure_url;
};

const Profile = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		address: "",
		profilePic: "",
		password: "",
		role: "",
	});

	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState("");
	const [uploading, setUploading] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await API.get("/api/user/profile");
				setFormData({
					name: res.data.name || "",
					email: res.data.email || "",
					phone: res.data.phone || "",
					address: res.data.address || "",
					profilePic: res.data.profilePic || "",
					password: "",
					role: res.data.role || "",
				});
			} catch (err) {
				console.log(err);
			} finally {
				setLoading(false);
			}
		};
		fetchProfile();
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > 5 * 1024 * 1024) {
			toast.error("Image must be under 5 MB");
			return;
		}

		setImageFile(file);
		setImagePreview(URL.createObjectURL(file));
	};

	const handleSubmit = async () => {
		try {
			setUploading(true);

			let profilePicUrl = formData.profilePic;

			if (imageFile) {
				toast.loading("Uploading image...");
				profilePicUrl = await uploadToCloudinary(imageFile);
				toast.dismiss();
			}

			await API.put("/api/user/profile", {
				name: formData.name,
				email: formData.email,
				phone: formData.phone,
				address: formData.address,
				profilePic: profilePicUrl,
				password: formData.password,
			});

			setFormData(prev => ({ ...prev, profilePic: profilePicUrl, password: "" }));
			setImageFile(null);
			setImagePreview("");

			toast.success("Profile updated successfully");

		} catch (err) {
			toast.dismiss();
			console.log(err);
			toast.error("Failed to update profile");
		} finally {
			setUploading(false);
		}
	};

	if (loading) {
		return <div className="text-center mt-10">Loading...</div>;
	}

	const displayImage = imagePreview || formData.profilePic || "https://via.placeholder.com/120";

	return (
		<div className="max-w-3xl mx-auto">
			<div className="bg-white rounded-2xl shadow-xl p-8">

				{/* PROFILE PIC */}
				<div className="flex flex-col items-center mb-8">
					<div className="relative">
						<img
							src={displayImage}
							alt="Profile"
							className="w-28 h-28 rounded-full object-cover border-4 border-purple-400"
						/>

						<label
							htmlFor="profilePicInput"
							className="absolute bottom-0 right-0 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-purple-700"
							title="Change photo"
						>
							✏️
						</label>

						<input
							id="profilePicInput"
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="hidden"
						/>
					</div>

					{imageFile && (
						<p className="text-sm text-purple-600 mt-2">
							New photo selected — save to apply
						</p>
					)}

					<h1 className="text-3xl font-bold mt-4">My Profile</h1>
				</div>

				{/* FORM */}
				<div className="space-y-4">
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleChange}
						placeholder="Name"
						className="w-full border p-3 rounded-xl"
					/>

					<input
						type="email"
						name="email"
						value={formData.email}
						disabled
						onChange={handleChange}
						placeholder="Email"
						className="w-full border p-3 rounded-xl bg-gray-100"
					/>

					<input
						type="text"
						name="phone"
						value={formData.phone}
						onChange={handleChange}
						placeholder="Phone"
						className="w-full border p-3 rounded-xl"
					/>

					<input
						type="text"
						name="address"
						value={formData.address}
						onChange={handleChange}
						placeholder="Address"
						className="w-full border p-3 rounded-xl"
					/>

					<input
						type="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						placeholder="New Password (leave blank to keep current)"
						className="w-full border p-3 rounded-xl"
					/>

					<input
						type="text"
						value={formData.role}
						disabled
						className="w-full border p-3 rounded-xl bg-gray-100"
					/>

					<button
						onClick={handleSubmit}
						disabled={uploading}
						className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl hover:opacity-90 disabled:opacity-60"
					>
						{uploading ? "Saving..." : "Update Profile"}
					</button>
				</div>

			</div>
		</div>
	);
};

export default Profile;