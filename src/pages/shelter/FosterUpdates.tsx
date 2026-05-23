import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import { getFosterUpdates } from "../../services/fosterService";

const FosterUpdates = () => {
	const { petId } = useParams();

	const [updates, setUpdates] = useState<any[]>([]);
	const [pet, setPet] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		load();
	}, [petId]);

	const load = async () => {
		if (!petId) return;

		try {
			setLoading(true);

			// fetch both: pet + updates
			const [petRes, updatesRes] = await Promise.all([
				API.get(`/api/pet/${petId}`),
				getFosterUpdates(petId),
			]);

			setPet(petRes.data);
			setUpdates(updatesRes || []);
		}catch(err:any) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="text-center mt-10 text-gray-500">
				Loading foster updates... 🐾
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 py-8 px-4">

			<div className="max-w-5xl mx-auto">

				{/* HEADER */}
				<div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-3xl p-8 shadow-lg mb-8">
					<h1 className="text-4xl font-bold">
						🐾 Pet Updates
					</h1>
					<p className="mt-2 text-purple-100">
						Track foster parent activity and pet progress
					</p>
				</div>

				{/* FOSTER INFO */}
				<div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
					<h2 className="text-2xl font-bold mb-5">
						👤 Foster Information
					</h2>

					<div className="grid md:grid-cols-2 gap-6">

						<div>
							<p className="text-sm text-gray-500">
								Foster Parent
							</p>
							<p className="font-semibold text-lg">
								{pet?.fosteredBy?.name || "Not assigned"}
							</p>
						</div>

						<div>
							<p className="text-sm text-gray-500">
								Email
							</p>
							<p className="font-semibold">
								{pet?.fosteredBy?.email || "-"}
							</p>
						</div>

						<div>
							<p className="text-sm text-gray-500">
								Updates Count
							</p>
							<p className="font-semibold">
								{updates.length}
							</p>
						</div>

						<div>
							<p className="text-sm text-gray-500">
								Status
							</p>
							<p className="font-semibold">
								{pet?.status || "Active"}
							</p>
						</div>

					</div>
				</div>

				{/* UPDATES */}
				<div className="space-y-6">

					{updates.length === 0 ? (
						<div className="bg-white rounded-3xl p-10 shadow text-center">
							<div className="text-6xl mb-4">🐶</div>
							<h2 className="text-2xl font-bold">
								No Updates Yet
							</h2>
							<p className="text-gray-500 mt-2">
								Foster updates will appear here
							</p>
						</div>
					) : (
						updates.map((item) => (
							<div
								key={item._id}
								className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
							>
								<div className="flex items-start gap-4">

									<div className="bg-purple-100 h-12 w-12 rounded-full flex items-center justify-center text-2xl">
										🐾
									</div>

									<div className="flex-1">

										<p className="text-gray-800 text-lg">
											{item.message}
										</p>

										<p className="text-sm text-gray-400 mt-3">
											📅{" "}
											{new Date(
												item.createdAt
											).toLocaleString()}
										</p>

									</div>

								</div>
							</div>
						))
					)}

				</div>

			</div>

		</div>
	);
};

export default FosterUpdates;