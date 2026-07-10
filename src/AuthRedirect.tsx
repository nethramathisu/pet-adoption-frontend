import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const AuthRedirect = () =>
{
	const { user, loading } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() =>
	{
		if (loading) return;
		if (!user) return;

		// ONLY RUN ON ROOT OR LOGIN PAGE
		const publicPaths = ["/", "/login", "/register"];

		if (!publicPaths.includes(location.pathname)) return;

		if (user.role === "Shelter")
		{
			navigate("/shelter");
		} else if (user.role === "Foster")
		{
			navigate("/foster");
		} else
		{
			navigate("/");
		}
	}, [user, loading]);

	return null;
};

export default AuthRedirect;