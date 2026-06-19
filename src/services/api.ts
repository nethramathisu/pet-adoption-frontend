import axios from "axios";
// const BACKEND_URL = "http://localhost:5000";
const BACKEND_URL = "https://pet-adoption-backend-oylk.onrender.com";

fetch(`${BACKEND_URL}/health`).catch(() => {});

const API = axios.create({
	baseURL: BACKEND_URL,
	withCredentials: true,
	timeout: 60000, 
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
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

// ✅ Only retry on GET requests — never retry POST (creates duplicates!)
API.interceptors.response.use(
	(response) => response,
	async (error) =>
	{
		const config = error.config;
		const isGet = config.method?.toLowerCase() === "get";

		if (!config._retried && isGet && (error.code === "ECONNABORTED" || !error.response))
		{
			config._retried = true;
			console.warn("GET request failed, retrying after 3s...");
			await new Promise((res) => setTimeout(res, 3000));
			return API(config);
		}

		return Promise.reject(error);
	}
);

export default API;