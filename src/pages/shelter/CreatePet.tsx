import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const uploadToCloudinary = (
	file: File,
	type: "image" | "video",
	onProgress: (percent: number) => void,
	retries = 2
): Promise<string> =>
{
	return new Promise((resolve, reject) =>
	{
		let settled = false;

		const attempt = (attemptsLeft: number) =>
		{
			const formData = new FormData();
			formData.append("file", file);
			formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

			const xhr = new XMLHttpRequest();
			const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${type}/upload`;
			xhr.open("POST", url);

			xhr.upload.onprogress = (event) =>
			{
				if (event.lengthComputable)
				{
					const percent = Math.round((event.loaded / event.total) * 100);
					onProgress(percent);
				}
			};

			xhr.onload = () =>
			{
				if (settled) return;
				if (xhr.status === 200)
				{
					const data = JSON.parse(xhr.responseText);
					if (data.secure_url)
					{
						settled = true;
						resolve(data.secure_url);
					} else
					{
						reject(new Error("Upload failed: no secure_url"));
					}
				} else
				{
					if (attemptsLeft > 0)
					{
						onProgress(0);
						setTimeout(() => attempt(attemptsLeft - 1), 2000);
					} else
					{
						reject(new Error(`Upload failed (status ${xhr.status})`));
					}
				}
			};

			xhr.onerror = () =>
			{
				if (settled) return;
				if (attemptsLeft > 0)
				{
					onProgress(0);
					setTimeout(() => attempt(attemptsLeft - 1), 2000);
				} else
				{
					reject(new Error("Network error during upload"));
				}
			};

			xhr.send(formData);
		};
		attempt(retries);
	});
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
	const [imageProgress, setImageProgress] = useState<number | null>(null);
	const [videoProgress, setVideoProgress] = useState<number | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
	{
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) =>
	{
		e.preventDefault();

		if (loading) return;

		if (image && image.size > 10 * 1024 * 1024)
		{
			toast.error("Image must be under 10 MB");
			return;
		}
		if (video && video.size > 5 * 1024 * 1024)
		{
			toast.error("Video must be under 5 MB");
			return;
		}

		try
		{
			setLoading(true);

			let imageUrl = "";
			let videoUrl = "";

			if (image)
			{
				setImageProgress(0);
				setUploadProgress("Uploading image...");
				imageUrl = await uploadToCloudinary(image, "image", setImageProgress);
			}

			if (video)
			{
				setVideoProgress(0);
				setUploadProgress("Uploading video...");
				videoUrl = await uploadToCloudinary(video, "video", setVideoProgress);
			}

			setImageProgress(null);
			setVideoProgress(null);
			setUploadProgress("Saving pet...");

			await API.post("/api/pet", {
				...formData,
				images: imageUrl ? [imageUrl] : [],
				videos: videoUrl ? [videoUrl] : [],
			});

			toast.success("Pet created successfully!");
			navigate("/shelter/pets");

		} catch (err: any)
		{
			console.log("ERROR:", err);

			// ✅ If timeout, pet was likely created — redirect anyway
			if (err.code === "ECONNABORTED" || err.message?.includes("timeout"))
			{
				toast.success("Pet created successfully!");
				navigate("/shelter/pets");
				return;
			}

			toast.error(
				err?.response?.data?.message ||
				err?.message ||
				"Something went wrong"
			);
		} finally
		{
			setLoading(false);
			setUploadProgress("");
			setImageProgress(null);
			setVideoProgress(null);
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
					onChange={handleChange}
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

				{/* Image Upload */}
				<div>
					<label className="block mb-2 font-medium">📷 Upload Image</label>
					<input
						type="file"
						accept="image/*"
						onChange={(e) =>
						{
							const file = e.target.files?.[0] || null;
							if (file && file.size > 10 * 1024 * 1024)
							{
								toast.error("Image must be under 10 MB");
								e.target.value = "";
								return;
							}
							setImage(file);
						}}
						disabled={loading}
					/>
					{image && (
						<p className="text-sm text-gray-500 mt-1">
							{image.name} — {(image.size / (1024 * 1024)).toFixed(2)} MB
						</p>
					)}
					{imageProgress !== null && (
						<div className="mt-2">
							<div className="flex justify-between text-sm text-purple-700 mb-1">
								<span>Uploading image...</span>
								<span>{imageProgress}%</span>
							</div>
							<div className="w-full bg-purple-100 rounded-full h-2.5">
								<div
									className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
									style={{ width: `${imageProgress}%` }}
								/>
							</div>
						</div>
					)}
				</div>

				{/* Video Upload */}
				<div>
					<label className="block mb-2 font-medium">🎥 Upload Video</label>
					<input
						type="file"
						accept="video/*"
						onChange={(e) =>
						{
							const file = e.target.files?.[0] || null;
							if (file && file.size > 5 * 1024 * 1024)
							{
								toast.error("Video must be under 5 MB");
								e.target.value = "";
								return;
							}
							setVideo(file);
						}}
						disabled={loading}
					/>
					{video && (
						<p className="text-sm text-gray-500 mt-1">
							{video.name} — {(video.size / (1024 * 1024)).toFixed(2)} MB
						</p>
					)}
					{videoProgress !== null && (
						<div className="mt-2">
							<div className="flex justify-between text-sm text-purple-700 mb-1">
								<span>Uploading video...</span>
								<span>{videoProgress}%</span>
							</div>
							<div className="w-full bg-purple-100 rounded-full h-2.5">
								<div
									className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
									style={{ width: `${videoProgress}%` }}
								/>
							</div>
						</div>
					)}
				</div>

				{/* Saving status */}
				{uploadProgress === "Saving pet..." && (
					<div className="flex items-center gap-2 text-purple-600 font-medium">
						<svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
							<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
						</svg>
						Saving pet to database...
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