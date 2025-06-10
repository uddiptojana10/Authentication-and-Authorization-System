import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
          });
          const response = await axios.get('http://localhost:4000/api/user/role', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setRole(response.data.role);
        } catch (err) {
          console.error('Error fetching role:', err);
          setError(err.response?.data?.error || 'Failed to fetch role');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchRole();
  }, [isAuthenticated, getAccessTokenSilently]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-blue-500 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          <p className="mt-3 text-lg text-gray-300 font-light">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-xl text-red-500 font-medium">Please log in to view your profile.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-xl text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-6 sm:px-12">
      <div className="w-full max-w-md mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Your Profile</h2>
          <p className="mt-2 text-base text-gray-400 font-light">
            View your account details
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          {user.picture && (
            <div className="flex justify-center">
              <img
                src={user.picture}
                alt="Profile"
                className="h-24 w-24 rounded-full border-2 border-gray-700"
              />
            </div>
          )}
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-400 font-light">Name</p>
              <p className="text-lg text-white font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 font-light">Email</p>
              <p className="text-lg text-white font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 font-light">Role</p>
              <p
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  role === 'admin'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;