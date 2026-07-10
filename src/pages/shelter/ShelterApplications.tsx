import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import toast from "react-hot-toast";

interface Application
{
	_id: string;
	status: string;
	message: string;

	infoRequest?: string;
	houseType?: string;
	existingPets?: string;
	contactNumber?: string;
	address?: string;
	user: {
		_id: string;
		name: string;
		email: string;
	};

	pet: {
		_id: string;
		name: string;
		images: string[];
	} | null;
}

const ShelterApplications = () =>
{

	const navigate = useNavigate();

	const [applications, setApplications] =
		useState<Application[]>([]);

	const [selectedApplication, setSelectedApplication] =
		useState<string | null>(null);

	const [showApproveModal, setShowApproveModal] = useState(false);

	const defaultApprovalMessage = `Thank you for your interest in adopting one of our pets! We are delighted to inform you that your adoption application has been approved.

We sincerely appreciate the time and effort you took to complete your application. Based on the information you provided, we believe you can offer a safe, loving, and caring forever home for your new companion.

Our team will contact you shortly to guide you through the next steps, including the adoption process and meeting arrangements.

Congratulations, and thank you for choosing adoption. Together, we're giving a pet the loving home they deserve!`;


	const [approvalMessage, setApprovalMessage] = useState(defaultApprovalMessage);
	const [selectedApprovalId, setSelectedApprovalId] =
		useState<string | null>(null);

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


	const updateStatus = async (
		id: string,
		status: string,
		responseMessage = ""
	) =>
	{
		try
		{
			console.log("CLICKED:", id, status);

			const res = await API.put(`/api/applications/${id}`, {
				status,
				responseMessage,
			});

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
	const handleRequestInfo = async (
		applicationId: string,
		message: string
	) =>
	{
		try
		{
			await API.put(
				`/api/applications/${applicationId}/request-info`,
				{ message }
			);

			toast.success(
				"Information requested successfully"
			);

			fetchApplications();
		}
		catch (error: any)
		{
			toast.error(
				error.response?.data?.message ||
				"Failed"
			);
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
										${app.status === "Approved"
												? "bg-green-100 text-green-700"
												: app.status === "Rejected"
													? "bg-red-100 text-red-700"
													: app.status === "Info Requested"
														? "bg-yellow-100 text-yellow-700"
														: app.status === "Info Submitted"
															? "bg-blue-100 text-blue-700"
															: "bg-gray-100 text-gray-700"
											}`}
									>
										{app.status}
									</span>
								</div>

								{/* ACTIONS */}
								{/* ACTIONS */}
								<div className="mt-4 flex flex-col gap-3">

									{/* Status-based actions */}
									{(app.status === "Pending" ||
										app.status === "Info Submitted") && (
											<div className="flex gap-3 flex-wrap">
												<button
													onClick={() =>
													{
														setSelectedApprovalId(app._id);

														setApprovalMessage(defaultApprovalMessage);

														setShowApproveModal(true);
													}}
													className="bg-green-600 text-white px-4 py-2 rounded-xl"
												>
													Approve
												</button>

												<button
													onClick={() => updateStatus(app._id, "Rejected")}
													className="bg-red-600 text-white px-4 py-2 rounded-xl"
												>
													Reject
												</button>

												<button
													onClick={() =>
													{
														setSelectedApplication(app._id);
													}}
													className="bg-yellow-500 text-white px-4 py-2 rounded-xl"
												>
													Request Info
												</button>
											</div>
										)}

									{/* Message button ALWAYS aligned */}
									<button
										onClick={() =>
										{
											if (!app.pet?._id)
											{
												toast.error("Pet no longer exists");
												return;
											}

											navigate(`/app/chat/${app.user._id}/${app.pet._id}`);
										}}
										className="bg-purple-600 text-white px-4 py-2 rounded-xl w-fit"
									>
										💬 Message
									</button>
									{app.infoRequest && (
										<div className="bg-yellow-50 p-3 rounded-lg">
											<h4 className="font-semibold">
												Information Requested
											</h4>

											<p>{app.infoRequest}</p>
										</div>
									)}
									{app.status === "Info Submitted" && (
										<div className="bg-blue-50 p-3 rounded-lg">
											<h4 className="font-semibold">
												Applicant Information
											</h4>

											<p><b>House Type:</b> {app.houseType}</p>
											<p><b>Existing Pets:</b> {app.existingPets}</p>
											<p><b>Contact Number:</b> {app.contactNumber}</p>
											<p><b>Address:</b> {app.address}</p>
										</div>
									)}
								</div>

							</div>
						</div>
					))}
			</div>
			{selectedApplication && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">

						<h2 className="text-xl font-bold mb-4">
							Request Additional Information
						</h2>

						<div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
							<p className="font-medium mb-3">
								Please provide:
							</p>

							<ul className="list-disc pl-5 space-y-2">
								<li>House Type</li>
								<li>Existing Pets</li>
								<li>Contact Number</li>
								<li>Address</li>
							</ul>
						</div>

						<div className="flex justify-end gap-3 mt-4">

							<button
								onClick={() =>
								{
									setSelectedApplication(null);
								}}
								className="px-4 py-2 border rounded-lg"
							>
								Cancel
							</button>

							<button
								onClick={async () =>
								{
									await handleRequestInfo(
										selectedApplication,
										"Please provide House Type, Existing Pets, Contact Number and Address."
									);

									setSelectedApplication(null);
								}}
								className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
							>
								Send Request
							</button>

						</div>
					</div>
				</div>
			)}

			{showApproveModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl">

						<h2 className="text-2xl font-bold mb-4">
							Approve Adoption Application
						</h2>

						<p className="text-gray-600 mb-3">
							You can edit the message below before sending it to the adopter.
						</p>

						<textarea
							rows={10}
							value={approvalMessage}
							onChange={(e) => setApprovalMessage(e.target.value)}
							className="w-full border rounded-lg p-3"
						/>

						<div className="flex justify-end gap-3 mt-5">

							<button
								onClick={() =>
								{
									setShowApproveModal(false);
									setSelectedApprovalId(null);
								}}
								className="px-4 py-2 border rounded-lg"
							>
								Cancel
							</button>

							<button
								onClick={async () =>
								{
									if (!selectedApprovalId) return;

									await updateStatus(
										selectedApprovalId,
										"Approved",
										approvalMessage
									);

									setShowApproveModal(false);
									setSelectedApprovalId(null);
								}}
								className="bg-green-600 text-white px-5 py-2 rounded-lg"
							>
								Approve & Send
							</button>

						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ShelterApplications;