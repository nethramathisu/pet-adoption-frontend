import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import toast from "react-hot-toast";

interface Application
{
	_id: string;
	status: string;
	message: string;

	user: {
		_id: string;
		name: string;
		email: string;
	};

	pet: {
		_id: string;
		name: string;
		images: string[];
	} | null; // ✅ important fix
}

const ShelterApplications = () =>
{
	const navigate = useNavigate();

	const [applications, setApplications] =
		useState<Application[]>([]);

	const [loading, setLoading] =
		useState(true);
	const fetchApplications = async () =>
	{
		try
		{
			const res = await API.get(
				"/api/applications/shelter"
			);

			console.log("FETCH RUN:", new Date().toLocaleTimeString());
			setApplications(res.data);
		} catch (err: any)
		{
			console.log(err);
			toast.error("Failed to load applications");
		} finally
		{
			setLoading(false);
		}
	};

	useEffect(() =>
	{

		fetchApplications();
	}, []);


	const updateStatus = async (id: string, status: string) =>
	{
		try
		{
			console.log("CLICKED:", id, status);

			const res = await API.put(`/api/applications/${id}`, { status });

			console.log("PUT RESPONSE:", res.data);

			const updated = await API.get("/api/applications/shelter");

			console.log("GET AFTER UPDATE:", updated.data);

			setApplications(updated.data);

			toast.success("Updated");
		} catch (err)
		{
			console.log("ERROR:", err);
		}
	};

	if (loading)
	{
		return (
			<div className="text-center mt-10">
				Loading applications...
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto py-8">
			<h1 className="text-3xl font-bold mb-8">
				📄 Adoption Applications
			</h1>

			<div className="space-y-6">

				{applications
					.filter((app) => app.pet)
					.map((app) => (
						<div
							key={app._id}
							className="bg-white shadow-xl rounded-2xl p-6 flex gap-6"
						>

							{/* PET IMAGE */}
							<img
								src={
									app.pet?.images?.[0] ||
									"https://via.placeholder.com/150"
								}
								className="w-32 h-32 rounded-xl object-cover"
							/>

							<div className="flex-1">

								{/* PET NAME */}
								<h2 className="text-2xl font-bold">
									{app.pet?.name ||
										"Deleted Pet"}
								</h2>

								{/* USER INFO */}
								<p className="text-gray-600 mt-1">
									Applicant:{" "}
									{app.user.name}
								</p>

								<p className="text-gray-600">
									{app.user.email}
								</p>

								{/* MESSAGE */}
								<div className="mt-4">
									<p className="font-semibold">
										Message:
									</p>
									<p className="text-gray-700">
										{app.message}
									</p>
								</div>

								{/* STATUS */}
								<div className="mt-3">
									<span
										className={`px-3 py-1 rounded-full text-sm font-semibold
										${app.status === "approved"
												? "bg-green-100 text-green-700"
												: app.status === "rejected"
													? "bg-red-100 text-red-700"
													: app.status ===
														"request_more_info"
														? "bg-yellow-100 text-yellow-700"
														: "bg-gray-100 text-gray-700"
											}`}
									>
										{app.status}
									</span>
								</div>

								{/* ACTIONS */}
								<div className="mt-4 flex gap-3 flex-wrap">

									<button
										onClick={() =>
											updateStatus(
												app._id,
												"approved"
											)
										}
										className="bg-green-600 text-white px-4 py-2 rounded-xl"
									>
										Approve
									</button>

									<button
										onClick={() =>
											updateStatus(
												app._id,
												"rejected"
											)
										}
										className="bg-red-600 text-white px-4 py-2 rounded-xl"
									>
										Reject
									</button>

									<button
										onClick={() =>
											updateStatus(
												app._id,
												"request_more_info"
											)
										}
										className="bg-yellow-500 text-white px-4 py-2 rounded-xl"
									>
										Request Info
									</button>

									<button
										onClick={() =>
										{
											if (!app.pet?._id)
											{
												toast.error(
													"Pet no longer exists"
												);
												return;
											}

											navigate(
												`/app/chat/${app.user._id}/${app.pet._id}`
											);
										}}
										className="bg-purple-600 text-white px-4 py-2 rounded-xl"
									>
										💬 Message
									</button>

								</div>

							</div>
						</div>
					))}
			</div>
		</div>
	);
};

export default ShelterApplications;