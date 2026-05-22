import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
	getMyFosterPets,
} from "../../services/fosterService";

const MyFosterPets = () => {
	const [pets, setPets] =
		useState([]);

	const navigate =
		useNavigate();

	useEffect(() => {
		loadPets();
	}, []);

	const loadPets = async () => {
		try {
			const data =
				await getMyFosterPets();

			setPets(data);
		}catch(err:any) {
			console.log(err);
		}
	};

	return (
		<div className="p-6">

			<h1 className="text-2xl font-bold mb-6">
				My Foster Pets
			</h1>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

				{pets.map((pet: any) => (

					<div
						key={pet._id}
						className="bg-white shadow-lg rounded-2xl overflow-hidden"
					>

						<img
							src={
								pet.images?.[0] ||
								"https://via.placeholder.com/300"
							}
							className="h-48 w-full object-cover"
						/>

						<div className="p-4">

							<h2 className="text-xl font-bold">
								{pet.name}
							</h2>

							<p className="text-gray-500 mb-4">
								{pet.breed}
							</p>

							<button
								onClick={() =>
									navigate(
										`/foster/update/${pet._id}`
									)
								}
								className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
							>
								📝 Add Update
							</button>

						</div>

					</div>

				))}

			</div>

		</div>
	);
};

export default MyFosterPets;