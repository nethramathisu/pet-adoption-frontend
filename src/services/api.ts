import axios from "axios";

const API = axios.create({
	//   baseURL: "http://localhost:5000",
	baseURL: "https://pet-adoption-backend-oylk.onrender.com",
	withCredentials: true,
	headers: {
		"Cache-Control": "no-cache",
		"Pragma": "no-cache",
		"Expires": "0",
	},

});

API.interceptors.request.use((config) =>
{
	const token = localStorage.getItem("token");
	if (config.method?.toLowerCase() === "get")
	{
		config.params = {
			...config.params,
			_t: Date.now(),
		};
	}

	if (token)
	{
		config.headers.Authorization =
			`Bearer ${token}`;
	}

	return config;
});

export default API;