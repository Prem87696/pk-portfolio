import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }: any) {
  const { user, loading } = useAuth();

  // 🔹 Jab tak auth check ho raha hai
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-b-2 border-white rounded-full"></div>
      </div>
    );
  }

  // 🔹 Agar user nahi hai → redirect
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // 🔹 Agar logged in hai → access
  return children;
}
