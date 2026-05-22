import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import toast from "react-hot-toast";

const EditPet = () => {
	const { id } = useParams();
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

	useEffect(() => {
		fetchPet();
	}, []);

	const fetchPet = async () => {
		try {
			const res = await API.get(`/pet/${id}`);

			setFormData({
				name: res.data.name || "",
				breed: res.data.breed || "",
				age: res.data.age || "",
				size: res.data.size || "",
				location: res.data.location || "",
				color: res.data.color || "",
				medicalHistory:
					res.data.medicalHistory || ""
			});
		}
		catch (err) {
			console.log(err);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async (
		e: React.FormEvent
	) => {
		e.preventDefault();

		try {
			await API.put(
				`/pet/${id}`,
				formData
			);

			toast.success(
				"Pet updated successfully"
			);

			navigate("/shelter/pets");

		}
		catch (err: any) {
			toast.error(
				err?.response?.data?.message ||
				"Update failed"
			);
		}
	};

	return (
		<div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">

			<h1 className="text-3xl font-bold mb-6">
				Edit Pet
			</h1>

			<form
				onSubmit={handleSubmit}
				className="space-y-4"
			>

				<input
					name="name"
					value={formData.name}
					onChange={handleChange}
					placeholder="Name"
					className="w-full border p-3 rounded"
				/>

				<input
					name="breed"
					value={formData.breed}
					onChange={handleChange}
					placeholder="Breed"
					className="w-full border p-3 rounded"
				/>

				<input
					name="age"
					value={formData.age}
					onChange={handleChange}
					placeholder="Age"
					className="w-full border p-3 rounded"
				/>

				<input
					name="size"
					value={formData.size}
					onChange={handleChange}
					placeholder="Size"
					className="w-full border p-3 rounded"
				/>

				<input
					name="location"
					value={formData.location}
					onChange={handleChange}
					placeholder="Location"
					className="w-full border p-3 rounded"
				/>

				<input
					name="color"
					value={formData.color}
					onChange={handleChange}
					placeholder="Color"
					className="w-full border p-3 rounded"
				/>

				<input
					name="medicalHistory"
					value={formData.medicalHistory}
					onChange={handleChange}
					placeholder="Medical History"
					className="w-full border p-3 rounded"
				/>

				<button
					type="submit"
					className="w-full bg-yellow-500 text-white py-3 rounded"
				>
					Update Pet
				</button>

			</form>

		</div>
	);
};

export default EditPet;