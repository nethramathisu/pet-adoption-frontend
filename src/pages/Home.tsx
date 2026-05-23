import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPets } from "../services/petService";
import { useAuth } from "../context/AuthContext";

interface Pet
{
	_id: string;
	name: string;
	breed: string;
	age: number;
	size: string;
	location: string;
	images: string[];
}

const Home = () =>
{
	const navigate = useNavigate();
	const { user } = useAuth();
	const [pets, setPets] = useState<Pet[]>([]);
	const [loading, setLoading] = useState(true);

	const [filters, setFilters] = useState({
		search: "",
		breed: "",
		size: "",
		age: "",
	});

	const fetchPets = async () =>
	{
		try
		{
			setLoading(true);

			const query = new URLSearchParams(
				Object.entries(filters)
					.filter(([_, value]) => String(value).trim() !== "")
			).toString();

			const data = await getPets(query);

			setPets(data.pets || data);

		} catch (err: any)
		{
			console.log("Fetch pets error:", err);

		} finally
		{
			setLoading(false);
		}
	};
	const handleProtectedNavigation = (path: string) =>
	{
		if (!user)
		{
			navigate("/login");
			return;
		}

		navigate(path);
	};
	useEffect(() =>
	{
		const timer = setTimeout(() =>
		{
			fetchPets();
		}, 500);

		return () => clearTimeout(timer);

	}, [filters]);



	return (
		<div className="py-6">

			{/* TITLE */}
			<h1 className="text-3xl font-bold mb-6 text-gray-800">
				🐶 Available Pets for Adoption
			</h1>

			{/* FILTERS */}
			{/* FILTERS */}
			<div className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">

				<input
					type="text"
					placeholder="Search pets..."
					value={filters.search}
					className="border p-2 rounded-lg"
					onChange={(e) =>
						setFilters({
							...filters,
							search: e.target.value,
						})
					}
				/>

				<input
					type="text"
					placeholder="Breed"
					value={filters.breed}
					className="border p-2 rounded-lg"
					onChange={(e) =>
						setFilters({
							...filters,
							breed: e.target.value,
						})
					}
				/>

				<select
					value={filters.size}
					className="border p-2 rounded-lg"
					onChange={(e) =>
						setFilters({
							...filters,
							size: e.target.value,
						})
					}
				>
					<option value="">All Sizes</option>
					<option value="small">Small</option>
					<option value="medium">Medium</option>
					<option value="large">Large</option>
				</select>

				<input
					type="number"
					placeholder="Max Age"
					value={filters.age}
					className="border p-2 rounded-lg"
					onChange={(e) =>
						setFilters({
							...filters,
							age: e.target.value,
						})
					}
				/>
			</div>

			{/* PET GRID */}
			{/* PET GRID */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">

				{loading && (
					<div className="col-span-full text-center text-gray-500 py-10 min-h-[100px]">
						Loading pets... 🐾
					</div>
				)}

				{!loading &&
					pets.map((pet) => (
						<div
							key={pet._id}
							className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden w-full"
						>

							{/* IMAGE */}
							<img
								src={
									pet.images?.[0] ||
									"https://via.placeholder.com/300"
								}
								className="h-48 w-full object-cover"
							/>

							{/* CONTENT */}
							<div className="p-4 space-y-2">

								<h2 className="text-xl font-semibold">
									{pet.name}
								</h2>

								<p className="text-gray-600">
									{pet.breed}
								</p>

								<div className="text-sm text-gray-500">
									Age: {pet.age} yrs | Size: {pet.size}
								</div>

								<div className="text-sm text-gray-400">
									📍 {pet.location}
								</div>

								{/* BUTTONS */}
								<div className="flex gap-2 mt-3">

									<button
										onClick={() => handleProtectedNavigation(`/pet/${pet._id}`)}
										className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
									>
										View
									</button>

									<button
										onClick={() =>
											handleProtectedNavigation(`/pet/${pet._id}`)
										}
										className="flex-1 bg-pink-500 text-white py-3 rounded-xl hover:bg-pink-600 transition"
									>
										Adopt
									</button>

								</div>

							</div>

						</div>
					))}

			</div>
		</div>
	);
};

export default Home;