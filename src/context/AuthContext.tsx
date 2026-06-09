import
	{
		createContext,
		useContext,
		useEffect,
		useState,
	} from "react";

interface User
{
	_id: string;
	name: string;
	email: string;
	role: string;
}

interface AuthContextType
{
	user: User | null;
	token: string | null;
	loading: boolean;

	login: (user: User, token: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
	children,
}: {
	children: React.ReactNode;
}) =>
{
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() =>
	{
		try
		{
			const storedToken = localStorage.getItem("token");
			const storedUser = localStorage.getItem("user");

			if (storedToken && storedUser)
			{
				setToken(storedToken);
				setUser(JSON.parse(storedUser));
			}
		} catch (err)
		{
			console.log("Invalid auth data");
			localStorage.clear();
			setUser(null);
			setToken(null);
		}

		setLoading(false);
	}, []);

	const login = (user: User, token: string) =>
	{
		localStorage.setItem("token", token);
		localStorage.setItem("user", JSON.stringify(user));

		setToken(token);
		setUser(user);
	};

	const logout = () =>
	{
		localStorage.removeItem("token");
		localStorage.removeItem("user");

		setToken(null);
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				login,
				logout,
				loading,   // ✅ IMPORTANT
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () =>
{
	const context = useContext(AuthContext);

	if (!context)
	{
		throw new Error("useAuth must be used inside AuthProvider");
	}

	return context;
};