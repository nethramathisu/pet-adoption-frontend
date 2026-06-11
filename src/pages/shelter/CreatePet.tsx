import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// 🔧 Replace these with your Cloudinary credentials
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const uploadToCloudinary = async (file: File, type: "image" | "video"): Promise<string> =>
{
	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

	const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${type}/upload`;

	const res = await fetch(url, { method: "POST", body: formData });
	const data = await res.json();

	if (!data.secure_url) throw new Error("Cloudinary upload failed");
	return data.secure_url;
};

const CreatePet = () =>
{
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		name: "",
		breed: "",
		age: "",
		size: "",
		location: "",
		color: "",
		medicalHistory: "",
	});

	const [image, setImage] = useState<File | null>(null);
	const [video, setVideo] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
	{
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) =>
	{
		e.preventDefault();

		if (image && image.size > 10 * 1024 * 1024)
		{
			toast.error("Image must be under 10 MB");
			return;
		}
		if (video && video.size > 20 * 1024 * 1024)
		{
			toast.error("Video must be under 20 MB");
			return;
		}

		try
		{
			setLoading(true);

			let imageUrl = "";
			let videoUrl = "";
			console.log("STEP 1: START");
			if (image)
			{
				setUploadProgress("Uploading image...");
				console.log("STEP 2: UPLOADING IMAGE");
				imageUrl = await uploadToCloudinary(image, "image");
				console.log("STEP 3: IMAGE DONE", imageUrl);

			}

			if (video)
			{
				setUploadProgress("Uploading video...");
				console.log("STEP 4: UPLOADING VIDEO");
				videoUrl = await uploadToCloudinary(video, "video");
				console.log("STEP 5: VIDEO DONE", videoUrl);
			}

			setUploadProgress("Saving pet...");
			console.log("STEP 6: ABOUT TO CALL BACKEND");
			const petRes = await API.post("/api/pet", {
				...formData,
				images: imageUrl ? [imageUrl] : [],
				videos: videoUrl ? [videoUrl] : [],
			});
			console.log("BACKEND RESPONSE:", petRes.data);
			toast.success("Pet created successfully!");
			navigate("/shelter/pets");

		} catch (err: any)
		{
			console.log("ERROR:", err);
			toast.error(
				err?.response?.data?.message ||
				err?.message ||
				"Something went wrong"
			);
		} finally
		{
			setLoading(false);
			setUploadProgress("");
		}
	};

	return (
		<div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">

			<h1 className="text-3xl font-bold mb-6">
				🐶 Add New Pet
			</h1>

			<form onSubmit={handleSubmit} className="space-y-5">

				<input
					type="text"
					name="name"
					placeholder="Pet Name"
					value={formData.name}
					onChange={handleChange}
					className="w-full border rounded-xl p-3"
					required
				/>

				<input
					type="text"
					name="breed"
					placeholder="Breed"
					value={formData.breed}
					onChange={handleChange}
					className="w-full border rounded-xl p-3"
					required
				/>

				<input
					type="number"
					name="age"
					placeholder="Age"
					value={formData.age}
					onChange={handleChange}
					className="w-full border rounded-xl p-3"
					required
				/>

				<select
					name="size"
					value={formData.size}
					onChange={(e) => setFormData({ ...formData, size: e.target.value })}
					className="w-full border rounded-xl p-3 text-gray-700"
				>
					<option value="">Select Size</option>
					<option value="small">Small</option>
					<option value="medium">Medium</option>
					<option value="large">Large</option>
				</select>

				<input
					type="text"
					name="color"
					placeholder="Color"
					value={formData.color}
					onChange={handleChange}
					className="w-full border rounded-xl p-3"
				/>

				<input
					type="text"
					name="location"
					placeholder="Location"
					value={formData.location}
					onChange={handleChange}
					className="w-full border rounded-xl p-3"
				/>

				<input
					type="text"
					name="medicalHistory"
					placeholder="Medical History"
					value={formData.medicalHistory}
					onChange={handleChange}
					className="w-full border rounded-xl p-3"
				/>

				<div>
					<label className="block mb-2 font-medium">📷 Upload Image</label>
					<input
						type="file"
						accept="image/*"
						onChange={(e) => setImage(e.target.files?.[0] || null)}
					/>
					{image && (
						<p className="text-sm text-gray-500 mt-1">
							{(image.size / (1024 * 1024)).toFixed(2)} MB
						</p>
					)}
				</div>

				<div>
					<label className="block mb-2 font-medium">🎥 Upload Video</label>
					<input
						type="file"
						accept="video/*"
						onChange={(e) => setVideo(e.target.files?.[0] || null)}
					/>
					{video && (
						<p className="text-sm text-gray-500 mt-1">
							{(video.size / (1024 * 1024)).toFixed(2)} MB
						</p>
					)}
				</div>

				{uploadProgress && (
					<div className="flex items-center gap-2 text-purple-600 font-medium">
						<svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
							<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
						</svg>
						{uploadProgress}
					</div>
				)}

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 disabled:opacity-60"
				>
					{loading ? "Please wait..." : "Create Pet"}
				</button>

			</form>
		</div>
	);
};

export default CreatePet;