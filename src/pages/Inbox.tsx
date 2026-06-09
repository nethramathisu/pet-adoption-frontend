import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyChats } from "../services/messageService";
import { useAuth } from "../context/AuthContext";

interface Chat
{
	_id: string;
	message: string;
	read: boolean;

	sender: {
		_id: string;
		name: string;
	};

	receiver: {
		_id: string;
		name: string;
	};

	pet: {
		_id: string;
		name: string;
		images: string[];
	};

	createdAt: string;
}

const Inbox = () =>
{
	const [chats, setChats] = useState<Chat[]>([]);
	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();
	const { user } = useAuth();

	useEffect(() =>
	{
		const fetchChats = async () =>
		{
			try
			{
				const data = await getMyChats();
				console.log(JSON.stringify(data, null, 2));
				setChats(data);
			} catch (err: any)
			{
				console.log(err);
			} finally
			{
				setLoading(false);
			}
		};

		fetchChats();
	}, []);

	const conversations = Object.values(
		chats.reduce((acc: Record<string, Chat>, chat) =>
		{
			const otherUser =
				chat.sender._id === user?._id
					? chat.receiver
					: chat.sender;

			const key = `${otherUser._id}-${chat.pet._id}`;

			if (
				!acc[key] ||
				new Date(chat.createdAt).getTime() >
				new Date(acc[key].createdAt).getTime()
			)
			{
				acc[key] = chat;
			}

			return acc;
		}, {})
	);

	if (loading)
	{
		return (
			<div className="text-center mt-10">
				Loading inbox...
			</div>
		);
	}

	return (
		<div className="max-w-5xl mx-auto py-6">
			{/* HEADER */}
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-3xl font-bold">
					📥 Inbox
				</h1>
			</div>

			{/* EMPTY */}
			{conversations.length === 0 && (
				<div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
					No conversations yet.
				</div>
			)}

			{/* CHAT LIST */}
			<div className="space-y-4">
				{conversations.map((chat) =>
				{
					const otherUser =
						chat.sender._id === user?._id
							? chat.receiver
							: chat.sender;

					const unread =
						!chat.read &&
						chat.receiver._id === user?._id;

					return (
						<div
							key={chat._id}
							onClick={() =>
								navigate(
									`/app/chat/${otherUser._id}/${chat.pet._id}`
								)
							}
							className="bg-white shadow-md rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-xl transition"
						>
							{/* PET IMAGE */}
							<img
								src={
									chat.pet?.images?.[0] ||
									"https://via.placeholder.com/100"
								}
								alt={chat.pet?.name}
								className="w-20 h-20 rounded-xl object-cover"
							/>

							{/* CONTENT */}
							<div className="flex-1">
								<div className="flex items-center justify-between">
									<h2 className="text-lg font-semibold">
										{otherUser.name}
									</h2>

									{unread && (
										<span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
											New
										</span>
									)}
								</div>

								<p className="text-sm text-gray-500">
									Pet: {chat.pet?.name}
								</p>

								<p className="text-gray-700 mt-1 truncate">
									{chat.message}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Inbox;