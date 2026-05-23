import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { removeFoster } from "../../services/fosterService";
import AssignFosterModal from "../../components/AssignFosterModal.tsx";
import toast from "react-hot-toast";

interface Pet
{
	_id: string;
	name: string;
	breed: string;
	status: string;
	images: string[];
}

const ShelterPets = () =>
{
	const navigate = useNavigate();

	const [pets, setPets] = useState<Pet[]>([]);
	const [loading, setLoading] = useState(true);

	const [showModal, setShowModal] = useState(false);
	const [selectedPet, setSelectedPet] = useState("");

	const fetchPets = async () =>
	{
		try
		{
			const res = await API.get("/api/pet");

			setPets(res.data?.pets || res.data || []);
		}catch(err:any)
		{
			console.log(err);
			setPets([]);
		} finally
		{
			setLoading(false);
		}
	};
	useEffect(() =>
	{
		fetchPets();
	}, []);

	const openModal = (petId: string) =>
	{
		setSelectedPet(petId);
		setShowModal(true);
	};

	const closeModal = () =>
	{
		setSelectedPet("");
		setShowModal(false);
	};

	const handleDeletePet = async (petId: string) =>
	{
		try
		{
			const confirmDelete = window.confirm("Delete this pet?");
			if (!confirmDelete) return;

			await API.delete(`/api/pet/${petId}`);

			toast.success("Pet deleted successfully");

			setPets((prev) =>
				prev.filter((pet) => pet._id !== petId)
			);
		} catch (err: any)
		{
			console.log(err);

			toast.error(
				err?.response?.data?.message || "Delete failed"
			);
		}
	};

	const handleRemoveFoster = async (petId: string) =>
	{
		try
		{
			await removeFoster(petId);

			toast.success("Foster removed");

			fetchPets();
		}catch(err:any)
		{
			console.log(err);
		}
	};

	if (loading)
	{
		return (
			<div className="text-center mt-10">
				Loading pets...
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto py-8">

			{/* TOP SECTION */}
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">🐶 My Pets</h1>

				<button
					onClick={() => navigate("/shelter/create-pet")}
					className="bg-purple-600 text-white px-5 py-3 rounded-xl hover:bg-purple-700"
				>
					➕ Create Pet
				</button>
			</div>

			{/* PET GRID */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

				{pets?.map((pet) => (
					<div
						key={pet._id}
						className="bg-white shadow-xl rounded-2xl overflow-hidden"
					>
						<img
							src={
								pet.images?.[0] ||
								"https://via.placeholder.com/300"
							}
							className="h-52 w-full object-cover"
						/>

						<div className="p-4">

							<h2 className="text-2xl font-bold">
								{pet.name}
							</h2>

							<p className="text-gray-500">
								{pet.breed}
							</p>

							<div className="mt-3 mb-4">
								<span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
									{pet.status}
								</span>
							</div>

							{/* ACTIONS */}
							<div className="grid grid-cols-2 gap-2">

								<button
									onClick={() => openModal(pet._id)}
									className="bg-blue-600 text-white py-2 rounded"
								>
									Assign Foster
								</button>

								<button
									onClick={() =>
										handleRemoveFoster(pet._id)
									}
									className="bg-red-500 text-white py-2 rounded"
								>
									Remove Foster
								</button>

								<button
									onClick={() =>
										navigate(`/shelter/updates/${pet._id}`)
									}
									className="bg-purple-600 text-white py-2 rounded"
								>
									View Updates
								</button>

								<button
									onClick={() =>
										navigate(`/shelter/edit/${pet._id}`)
									}
									className="bg-yellow-500 text-white py-2 rounded"
								>
									Edit
								</button>

								<button
									onClick={() => handleDeletePet(pet._id)}
									className="bg-red-700 text-white py-2 rounded col-span-2 hover:bg-red-800"
								>
									Delete Pet
								</button>
							</div>
						</div>
					</div>
				))}

			</div>

			{/* MODAL */}
			{showModal && (
				<AssignFosterModal
					petId={selectedPet}
					onClose={closeModal}
					onSuccess={fetchPets}
				/>
			)}

		</div>
	);
};

export default ShelterPets;