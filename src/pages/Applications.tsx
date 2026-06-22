import { useEffect, useState } from "react";
import { getMyApplications } from "../services/applicationService";
import API from "../services/api";
import toast from "react-hot-toast";

interface Application
{
	_id: string;
	message: string;
	status: string;
	responseMessage?: string;

	infoRequest?: string;
	houseType?: string;
	existingPets?: string;
	contactNumber?: string;
	address?: string;

	pet: {
		_id: string;
		name: string;
		breed: string;
		images: string[];
	};
}

const MyApplications = () =>
{
	const [applications, setApplications] =
		useState<Application[]>([]);

	const [formData, setFormData] = useState<
		Record<
			string,
			{
				houseType: string;
				existingPets: string;
				contactNumber: string;
				address: string;
			}
		>
	>({});

	const [loading, setLoading] =
		useState(true);
	useEffect(() =>
	{
		const fetchApplications =
			async () =>
			{
				try
				{
					const data =
						await getMyApplications();

					setApplications(data);
				} catch (err: any)
				{
					console.log(err);
				} finally
				{
					setLoading(false);
				}
			};

		fetchApplications();
	}, []);
	const handleSubmitInfo = async (
		applicationId: string
	) =>
	{
		const data = formData[applicationId];

		if (!data?.houseType)
		{
			toast.error("Please select house type");
			return;
		}

		if (!data?.existingPets)
		{
			toast.error("Please select whether you have pets");
			return;
		}

		if (!data?.contactNumber?.trim())
		{
			toast.error("Contact Number is required");
			return;
		}

		if (!/^\d{10}$/.test(data.contactNumber))
		{
			toast.error("Enter a valid 10-digit phone number");
			return;
		}

		if (!data?.address?.trim())
		{
			toast.error("Address is required");
			return;
		}

		try
		{
			await API.put(
				`/api/applications/${applicationId}/submit-info`,
				data
			);

			toast.success(
				"Information submitted successfully"
			);

			const updatedApplications =
				await getMyApplications();

			setApplications(updatedApplications);

			setFormData(prev => ({
				...prev,
				[applicationId]: {
					houseType: "",
					existingPets: "",
					contactNumber: "",
					address: ""
				}
			}));
		}
		catch (error: any)
		{
			toast.error(
				error.response?.data?.message ||
				"Failed to submit information"
			);
		}
	};
	if (loading)
	{
		return (
			<div className="text-center mt-10 text-gray-500">
				Loading applications...
			</div>
		);
	}

	return (
		<div className="max-w-5xl mx-auto py-6">

			{/* TITLE */}
			<h1 className="text-3xl font-bold mb-6">
				📄 My Applications
			</h1>

			{/* EMPTY */}
			{applications.length === 0 && (
				<div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
					No applications yet.
				</div>
			)}

			{/* APPLICATIONS */}
			<div className="space-y-6">

				{applications.map((app) => (
					<div
						key={app._id}
						className="bg-white shadow-lg rounded-2xl overflow-hidden"
					>

						<div className="md:flex">

							{/* IMAGE */}
							<img
								src={
									app.pet?.images?.[0] ||
									"https://via.placeholder.com/300"
								}
								className="w-full md:w-64 h-64 object-cover"
							/>

							{/* CONTENT */}
							<div className="p-6 flex-1 space-y-4">

								{/* PET INFO */}
								<div>
									<h2 className="text-2xl font-bold">
										{app.pet?.name}
									</h2>

									<p className="text-gray-600">
										{app.pet?.breed}
									</p>
								</div>

								{/* USER MESSAGE */}
								<div>
									<h3 className="font-semibold">
										Your Application
									</h3>

									<p className="text-gray-600">
										{app.message}
									</p>
								</div>

								{/* STATUS */}
								{app.status === "Info Requested" && (
									<div className="bg-yellow-50 border border-yellow-300 p-4 rounded-xl">

										<h3 className="font-semibold mb-2">
											Additional Information Requested
										</h3>

										<p className="mb-4">{app.infoRequest}</p>

										<select
											className="w-full border p-2 rounded mb-3"
											value={formData[app._id]?.houseType || ""}
											onChange={(e) =>
												setFormData({
													...formData,
													[app._id]: {
														...formData[app._id],
														houseType: e.target.value,
													},
												})
											}
										>
											<option value="">Select House Type</option>
											<option value="Apartment">Apartment</option>
											<option value="Independent House">Independent House</option>
											<option value="Villa">Villa</option>
											<option value="Farm House">Farm House</option>
										</select>

										<select
											className="w-full border p-2 rounded mb-3"
											value={formData[app._id]?.existingPets || ""}
											onChange={(e) =>
												setFormData({
													...formData,
													[app._id]: {
														...formData[app._id],
														existingPets: e.target.value,
													},
												})
											}
										>
											<option value="">Do you already have pets?</option>
											<option value="Yes">Yes</option>
											<option value="No">No</option>
										</select>

										<input
											type="tel"
											placeholder="Contact Number"
											className="w-full border p-2 rounded mb-3"
											value={formData[app._id]?.contactNumber || ""}
											onChange={(e) =>
												setFormData({
													...formData,
													[app._id]: {
														...formData[app._id],
														contactNumber: e.target.value,
													},
												})
											}
										/>

										<textarea
											placeholder="Address"
											className="w-full border p-2 rounded mb-3"
											rows={3}
											value={formData[app._id]?.address || ""}
											onChange={(e) =>
												setFormData({
													...formData,
													[app._id]: {
														...formData[app._id],
														address: e.target.value,
													},
												})
											}
										/>

										<button
											onClick={() => handleSubmitInfo(app._id)}
											className="bg-blue-600 text-white px-4 py-2 rounded-lg"
										>
											Submit Information
										</button>

									</div>
								)}
								{app.status === "Info Submitted" && (
									<div className="bg-blue-50 border border-blue-300 p-4 rounded-xl">
										<h3 className="font-semibold mb-3">
											Information Submitted
										</h3>

										<p><strong>House Type:</strong> {app.houseType}</p>
										<p><strong>Existing Pets:</strong> {app.existingPets}</p>
										<p><strong>Contact Number:</strong> {app.contactNumber}</p>
										<p><strong>Address:</strong> {app.address}</p>
									</div>
								)}
								<div>
									<span className="font-semibold">
										Status:
									</span>

									<span
										className={`ml-3 px-3 py-1 rounded-full text-white text-sm ${app.status === "Approved"
											? "bg-green-500"
											: app.status === "Rejected"
												? "bg-red-500"
												: app.status === "Info Requested"
													? "bg-yellow-500"
													: app.status === "Info Submitted"
														? "bg-blue-500"
														: "bg-gray-500"
											}`}
									>
										{app.status}
									</span>
								</div>

								{/* RESPONSE */}
								{app.responseMessage && (
									<div className="bg-gray-100 p-4 rounded-xl">

										<h3 className="font-semibold mb-1">
											Shelter Response
										</h3>

										<p className="text-gray-700">
											{app.responseMessage}
										</p>

									</div>
								)}

							</div>

						</div>

					</div>
				))}

			</div>
		</div>
	);
};

export default MyApplications;