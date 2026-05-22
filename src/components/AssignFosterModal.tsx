import { useEffect, useState } from "react";
import { assignFoster, getAllFosters } from "../services/fosterService";
import toast from "react-hot-toast";

interface Foster
{
	_id: string;
	name: string;
}

interface Props
{
	petId: string;
	onClose: () => void;
	onSuccess: () => void | Promise<void>;
}

const AssignFosterModal = ({ petId, onClose, onSuccess }: Props) =>
{
	const [fosters, setFosters] = useState<Foster[]>([]);
	const [selectedFoster, setSelectedFoster] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() =>
	{
		const fetchFosters = async () =>
		{
			try
			{

				const data = await getAllFosters();
				setFosters(data || []);
			} catch (err)
			{
				console.log(err);
				toast.error("Failed to load fosters");
			}
		};

		fetchFosters();
	}, []);

	const handleAssign = async () =>
	{
		try
		{
			if (!selectedFoster)
			{
				toast.error("Please select a foster");
				return;
			}

			setLoading(true);

			await assignFoster(petId, selectedFoster);

			toast.success("Foster assigned successfully");

			await onSuccess();
			onClose();

		} catch (err: any)
		{
			console.log(err);

			toast.error(
				err?.response?.data?.message ||
				err?.message ||
				"Something went wrong"
			);
		} finally
		{
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

			<div className="bg-white w-96 p-6 rounded-xl">

				<h2 className="text-xl font-bold mb-4">
					Assign Foster
				</h2>

				{/* DROPDOWN */}
				<select
					value={selectedFoster}
					onChange={(e) => setSelectedFoster(e.target.value)}
					className="w-full border p-3 rounded mb-4"
				>
					<option value="">Select Foster</option>

					{fosters.map((foster) => (
						<option key={foster._id} value={foster._id}>
							{foster.name}
						</option>
					))}
				</select>

				<div className="flex gap-3">

					<button
						onClick={handleAssign}
					disabled={loading || !selectedFoster}
						className="flex-1 bg-green-600 text-white py-2 rounded"
					>
						{loading ? "Assigning..." : "Assign"}
					</button>

					<button
						onClick={onClose}
						className="flex-1 bg-red-600 text-white py-2 rounded"
					>
						Close
					</button>

				</div>

			</div>

		</div>
	);
};

export default AssignFosterModal;