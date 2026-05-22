import
	{
		useEffect,
		useState,
		useRef,
	} from "react";

import { useParams } from "react-router-dom";

import
	{
		getChats,
		sendMessage,
	} from "../services/messageService";

import { useAuth } from "../context/AuthContext";

interface Message
{
	_id: string;

	message: string;

	sender?: {
		_id: string;
		name: string;
	};

	receiver?: {
		_id: string;
		name: string;
	};

	createdAt: string;
}

const ChatPage = () =>
{
	const { userId, petId } =
		useParams();

	const { user } = useAuth();

	const [messages, setMessages] =
		useState<Message[]>([]);

	const [text, setText] =
		useState("");

	const [loading, setLoading] =
		useState(true);

	const bottomRef =
		useRef<HTMLDivElement | null>(
			null
		);

	// FETCH CHATS
	const fetchChats = async () =>
	{
		try
		{
			if (!userId || !petId) return;

			const data = await getChats(
				userId,
				petId
			);

			setMessages(data);
		} catch (err)
		{
			console.log(err);
		} finally
		{
			setLoading(false);
		}
	};

	useEffect(() =>
	{
		fetchChats();
	}, [userId, petId]);

	// AUTO SCROLL
	useEffect(() =>
	{
		bottomRef.current?.scrollIntoView({
			behavior: "smooth",
		});
	}, [messages]);

	// SEND MESSAGE
	const handleSend = async () => {
    if (!text.trim()) return;

    try {
        console.log("Route userId:", userId);
        console.log("PetId:", petId);
        console.log("Current user:", user?._id);

        const newMessage = await sendMessage(
            userId!,
            petId!,
            text
        );

        setMessages((prev) => [
            ...prev,
            newMessage,
        ]);

        setText("");

    } catch (err: any) {
        console.log(
            err.response?.data
        );

        console.log(err);
    }
};

	if (loading)
	{
		return (
			<div className="text-center mt-10">
				Loading chats...
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto h-[80vh] bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col">

			{/* HEADER */}
			<div className="bg-purple-600 text-white p-4 text-xl font-semibold">
				💬 Pet Chat
			</div>

			{/* MESSAGES */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">

				{messages.map((msg) =>
				{
					const isMe =
						msg.sender?._id ===
						user?._id;

					return (
						<div
							key={msg._id}
							className={`flex ${isMe
									? "justify-end"
									: "justify-start"
								}`}
						>

							<div
								className={`max-w-xs px-4 py-3 rounded-2xl shadow ${isMe
										? "bg-purple-600 text-white"
										: "bg-white"
									}`}
							>

								<p className="text-sm font-semibold mb-1">
									{msg.sender?.name ||
										"User"}
								</p>

								<p>{msg.message}</p>

							</div>

						</div>
					);
				})}

				{/* AUTO SCROLL TARGET */}
				<div ref={bottomRef}></div>

			</div>

			{/* INPUT */}
			<div className="p-4 border-t flex gap-3">

				<input
					type="text"
					placeholder="Type a message..."
					value={text}
					onChange={(e) =>
						setText(e.target.value)
					}
					className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
				/>

				<button
					onClick={handleSend}
					className="bg-purple-600 text-white px-6 rounded-xl hover:bg-purple-700"
				>
					Send
				</button>

			</div>

		</div>
	);
};

export default ChatPage;