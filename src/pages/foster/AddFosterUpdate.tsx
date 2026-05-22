import { useState } from "react";
import { useParams } from "react-router-dom";
import { addFosterUpdate } from "../../services/fosterService";
import toast from "react-hot-toast";

const AddFosterUpdate = () =>
{
	const { petId } =
		useParams();

	const [message,setMessage]=
		useState("");

	const submit=async()=>
	{
		if(!petId) return;

		try
		{
			await addFosterUpdate(
				petId,
				message
			);

			toast.success(
				"Update added"
			);

			setMessage("");

		}
		catch(err)
		{
			console.log(err);
		}
	};

	return(
	<div className="max-w-xl mx-auto p-6">

	<h1 className="text-2xl font-bold mb-5">
	Add Foster Update
	</h1>

	<textarea
	value={message}
	onChange={(e)=>
		setMessage(
			e.target.value
		)
	}
	className="w-full border p-4 rounded"
	placeholder="Write pet update..."
	/>

	<button
	onClick={submit}
	className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
	>
	Submit Update
	</button>

	</div>
	)
};

export default AddFosterUpdate;