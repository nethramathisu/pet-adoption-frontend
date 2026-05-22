import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, token, loading } = useAuth();

  // ⏳ wait until auth is loaded from localStorage
  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading...
      </div>
    );
  }

  //  if not logged in → go to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  //  allow access
  return <>{children}</>;
};

export default ProtectedRoute;