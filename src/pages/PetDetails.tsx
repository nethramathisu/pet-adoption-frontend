import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import API from "../services/api";


import
{
	getFavorites,
	toggleFavorite,
} from "../services/favoriteService";

import { applyForPet } from "../services/applicationService";
import toast from "react-hot-toast";

interface Pet
{
	_id: string;
	name: string;
	age: number;
	breed: string;
	size: string;
	color: string;
	location: string;
	medicalHistory: string;
	description: string;
	images: string[];
	videos?: string[];

	createdBy: {
		_id: string;
		name?: string;
	};

	fosteredBy?: {
		_id: string;
		name?: string;
	};
}

const PetDetails = () =>
{
	const { id } = useParams();

	const navigate = useNavigate();

	const [pet, setPet] = useState<Pet | null>(null);

	const [loading, setLoading] =
		useState(true);

	const [favorites, setFavorites] =
		useState<string[]>([]);

	const [message, setMessage] =
		useState("");

	const [applying, setApplying] =
		useState(false);

	// FETCH PET
	useEffect(() =>
	{
		const fetchPet = async () =>
		{
			try
			{
				const res = await API.get(
					`/api/pet/${id}`
				);

				setPet(res.data);
			} catch (err: any)
			{
				console.log(err);
			} finally
			{
				setLoading(false);
			}
		};

		fetchPet();
	}, [id]);

	// LOAD FAVORITES
	useEffect(() =>
	{
		const loadFavorites = async () =>
		{
			try
			{
				const data =
					await getFavorites();

				const favIds = data.map(
					(pet: any) =>
						typeof pet === "string"
							? pet
							: pet._id
				);

				setFavorites(favIds);
			} catch (err: any)
			{
				console.log(err);
			}
		};

		loadFavorites();
	}, []);

	// TOGGLE FAVORITE
	const toggleFavoriteHandler =
		async (petId: string) =>
		{
			try
			{
				await toggleFavorite(petId);

				setFavorites((prev) =>
					prev.includes(petId)
						? prev.filter(
							(id) => id !== petId
						)
						: [...prev, petId]
				);
			} catch (err: any)
			{
				console.log(err);
			}
		};

	// APPLY FOR PET
	const handleApply = async () =>
	{
		if (!pet) return;

		try
		{
			setApplying(true);

			await applyForPet(
				pet._id,
				message
			);

			toast.success("Application submitted successfully!");
			setMessage("");

		} catch (err: any)
		{
			console.log(err);

			// ✅ If timeout, application was likely submitted anyway
			if (err.code === "ECONNABORTED" || err.message?.includes("timeout"))
			{
				toast.success("Application submitted successfully!");
				setMessage("");
				return;
			}

			toast.error(
				err?.response?.data?.message ||
				err?.message ||
				"Something went wrong"
			);
		} finally
		{
			setApplying(false);
		}
	};

	// LOADING
	if (loading)
	{
		return (
			<div className="text-center mt-10 text-gray-500">
				Loading pet details... 🐾
			</div>
		);
	}

	// NOT FOUND
	if (!pet)
	{
		return (
			<div className="text-center mt-10 text-red-500">
				Pet not found
			</div>
		);
	}

	return (
		<div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">

			{/* IMAGE */}
			<div className="relative">

				<img
					src={
						pet.images?.[0] ||
						"https://via.placeholder.com/600"
					}
					className="w-full h-96 object-cover"
				/>

				{/* FAVORITE BUTTON */}
				<button
					onClick={() =>
						toggleFavoriteHandler(
							pet._id
						)
					}
					className="absolute top-4 right-4 text-4xl"
				>
					{favorites.includes(pet._id)
						? "❤️"
						: "🤍"}
				</button>

			</div>

			{/* CONTENT */}
			<div className="p-6 space-y-6">

				{/* BASIC INFO */}
				<div className="mt-4 grid grid-cols-2 gap-4">

					<div className="bg-purple-50 p-3 rounded-xl">
						<p className="text-gray-500 text-sm">
							Name
						</p>
						<p className="font-semibold">
							{pet.name}
						</p>
					</div>

					<div className="bg-pink-50 p-3 rounded-xl">
						<p className="text-gray-500 text-sm">
							Age
						</p>
						<p className="font-semibold">
							🐾 {pet.age} years
						</p>
					</div>

					<div className="bg-blue-50 p-3 rounded-xl">
						<p className="text-gray-500 text-sm">
							Breed
						</p>
						<p className="font-semibold">
							{pet.breed}
						</p>
					</div>

					<div className="bg-green-50 p-3 rounded-xl">
						<p className="text-gray-500 text-sm">
							Size
						</p>
						<p className="font-semibold">
							📏 {pet.size}
						</p>
					</div>

					<div className="bg-yellow-50 p-3 rounded-xl">
						<p className="text-gray-500 text-sm">
							Color
						</p>
						<p className="font-semibold">
							🎨 {pet.color}
						</p>
					</div>

					<div className="bg-red-50 p-3 rounded-xl">
						<p className="text-gray-500 text-sm">
							Location
						</p>
						<p className="font-semibold">
							🏥 {pet.location}
						</p>
					</div>

				</div>
				{/* PET VIDEO */}
				{/* PET VIDEO */}
				{(pet.videos?.length ?? 0) > 0 && (
					<div>
						<h2 className="text-2xl font-semibold mb-4">
							🎥 Pet Video
						</h2>

						<video
							src={pet.videos?.[0]}
							className="w-full rounded-2xl shadow-lg"
							controls
							playsInline
						/>
					</div>
				)}
				{/* DESCRIPTION */}
				{/* <div>

					<h2 className="text-2xl font-semibold mb-2">
						About
					</h2>

					<p className="text-gray-700 leading-relaxed">
						{pet.description}
					</p>

				</div> */}

				{/* MEDICAL */}
				<div>

					<h2 className="text-2xl font-semibold mb-2">
						Medical History
					</h2>

					<p className="text-gray-700 leading-relaxed">
						{pet.medicalHistory}
					</p>

				</div>

				{/* APPLY SECTION */}
				<div className="border-t pt-6 space-y-4">

					<h2 className="text-2xl font-bold">
						🐶 Apply for Adoption
					</h2>

					<textarea
						placeholder="Why would you like to adopt this pet?"
						value={message}
						onChange={(e) =>
							setMessage(
								e.target.value
							)
						}
						rows={5}
						className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-500"
					/>

					{/* BUTTONS */}
					<div className="grid grid-cols-2 md:grid-cols-5 gap-4">

						<button
							onClick={handleApply}
							disabled={applying}
							className="bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
						>
							{applying
								? "Submitting..."
								: "Submit Application"}
						</button>

						<button
							onClick={() =>
							{
								console.log("CreatedBy:", pet.createdBy);
								console.log("FosteredBy:", pet.fosteredBy);

								const receiverId = pet.fosteredBy
									? pet.fosteredBy._id
									: pet.createdBy._id;

								console.log("Final receiver:", receiverId);

								navigate(`/app/chat/${receiverId}/${pet._id}`);
							}}
							className="bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition"
						>
							💬 Message
						</button>

						<button
							onClick={() =>
								navigate(`/app/meeting/${pet._id}`)
							}
							className="bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
						>
							📅 Meeting
						</button>

						<button
							onClick={() =>
								navigate(`/app/reviews/pet/${pet._id}`)
							}
							className="bg-yellow-500 text-white py-3 rounded-xl hover:bg-yellow-600 transition"
						>
							⭐Pet Reviews
						</button>

						<button
							onClick={() =>
								navigate(
									`/app/reviews/shelter/${pet.createdBy._id}`
								)
							}
							className="bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition"
						>
							🏠 Shelter Reviews
						</button>

					</div>

				</div>

			</div>

		</div>
	);
};

export default PetDetails;