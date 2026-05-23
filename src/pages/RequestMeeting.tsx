import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

const RequestMeeting = () =>
{
	const { petId } = useParams();

	const [date, setDate] =
		useState("");

	const [message, setMessage] =
		useState("");

	const submitMeeting = async () =>
	{
		try
		{
			await API.post(
				`/api/meetings/request/${petId}`,
				{
					meetingDate: date,
					note: message
				}
			);

			toast.success(
				"Meeting request sent"
			);

			// Clear fields
			setDate("");
			setMessage("");

		} catch (err: any)
		{
			console.log(err);
		}
	};

	return (
		<div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-xl mt-8">

			<h1 className="text-2xl font-bold mb-6">
				📅 Request Meeting
			</h1>

			<input
				type="datetime-local"
				value={date}
				onChange={(e) =>
					setDate(
						e.target.value
					)
				}
				className="w-full border p-3 rounded-lg mb-4"
			/>

			<textarea
				placeholder="Message..."
				value={message}
				onChange={(e) =>
					setMessage(
						e.target.value
					)
				}
				className="w-full border p-3 rounded-lg h-32"
			/>

			<button
				onClick={submitMeeting}
				className="w-full mt-4 bg-blue-600 text-white p-3 rounded-lg"
			>
				Request Meeting
			</button>

		</div>
	);
};

export default RequestMeeting;