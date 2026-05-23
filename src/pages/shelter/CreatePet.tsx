import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CreatePet = () => {
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

	const [image, setImage] =
		useState<File | null>(null);

	const [video, setVideo] =
		useState<File | null>(null);

	const [loading, setLoading] =
		useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (
		e: React.FormEvent
	) => {
		e.preventDefault();

		console.log("Submit clicked");

	// Validate image size
	if (
		image &&
		image.size > 10 * 1024 * 1024
	) {
		toast.error(
			"Image must be under 10 MB"
		);
		return;
	}

	// Validate video size
	if (
		video &&
		video.size > 20 * 1024 * 1024
	) {
		toast.error(
			"Video must be under 20 MB"
		);
		return;
	}


		try {
			setLoading(true);

			const data = new FormData();

			Object.entries(formData).forEach(
				([key, value]) => {
					data.append(
						key,
						String(value)
					);
				}
			);

			if (image) {
				data.append(
					"images",
					image
				);
			}

			if (video) {
				data.append(
					"videos",
					video
				);
			}

			console.log(
				"Form data:",
				formData
			);
			console.log(
				"Image:",
				image
			);
			console.log(
				"Video:",
				video
			);

			const res = await API.post(
				"/api/pet",
				data
			);

			console.log(
				"Success:",
				res.data
			);

			toast.success(
				"Pet created successfully!"
			);

			navigate(
				"/shelter/pets"
			);

		}
		catch (err: any) {
			console.log(
				"FULL ERROR:",
				err
			);

			console.log(
				"STATUS:",
				err?.response?.status
			);

			console.log(
				"SERVER DATA:",
				err?.response?.data
			);

			toast.error(
				err?.response?.data?.message ||
				err?.message ||
				"Something went wrong"
			);
		}
		finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">

			<h1 className="text-3xl font-bold mb-6">
				🐶 Add New Pet
			</h1>

			<form
				onSubmit={handleSubmit}
				className="space-y-5"
			>

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

				<input
					type="text"
					name="size"
					placeholder="Size"
					value={formData.size}
					onChange={handleChange}
					className="w-full border rounded-xl p-3"
				/>

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
					value={
						formData.medicalHistory
					}
					onChange={handleChange}
					className="w-full border rounded-xl p-3"
				/>

				<div>
					<label className="block mb-2 font-medium">
						📷 Upload Image
					</label>

					<input
						type="file"
						accept="image/*"
						onChange={(e) =>
							setImage(
								e.target.files?.[0] || null
							)
						}
					/>
				</div>

				<div>
					<label className="block mb-2 font-medium">
						🎥 Upload Video
					</label>

					<input
						type="file"
						accept="video/*"
						onChange={(e) =>
							setVideo(
								e.target.files?.[0] || null
							)
						}
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700"
				>
					{loading
						? "Creating..."
						: "Create Pet"}
				</button>

			</form>

		</div>
	);
};

export default CreatePet;