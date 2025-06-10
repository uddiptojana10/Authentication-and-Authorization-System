import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

function AdminPage() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [role, setRole] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
          });
          // Fetch user role
          const roleResponse = await axios.get('http://localhost:4000/api/user/role', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setRole(roleResponse.data.role);

          // Fetch all users (admin only)
          if (roleResponse.data.role === 'admin') {
            const usersResponse = await axios.get('http://localhost:4000/api/users', {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(usersResponse.data);
          }
        } catch (err) {
          console.error('Error fetching data:', err);
          setError(err.response?.data?.error || 'Failed to fetch data');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, getAccessTokenSilently]);

  const handleRoleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });
      const response = await axios.post(
        'http://localhost:4000/api/user/role',
        { userId: selectedUserId, role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map((user) =>
        user.user_id === selectedUserId ? { ...user, role: newRole } : user
      ));
      setMessage(response.data.message);
      setSelectedUserId('');
      setNewRole('user');
    } catch (err) {
      console.error('Error updating role:', err);
      setMessage(err.response?.data?.error || 'Failed to update role');
    }
  };

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
        <p className="text-xl text-red-500 font-medium">Please log in to access the admin page.</p>
      </div>
    );
  }

  if (role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-xl text-red-500 font-medium">Access denied: Admin role required.</p>
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
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Admin Dashboard</h2>
          <p className="mt-2 text-base text-gray-400 font-light">
            Manage user roles with ease
          </p>
        </div>

        {/* Users Table */}
        {users.length === 0 ? (
          <p className="text-center text-gray-400 font-light">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-700 text-gray-300">
                  <th className="px-6 py-4 text-left font-medium">User ID</th>
                  <th className="px-6 py-4 text-left font-medium">Role</th>
                  <th className="px-6 py-4 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.user_id}
                    className="border-t border-gray-700 hover:bg-gray-700/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-gray-300 font-light truncate max-w-md">
                      {user.user_id}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          user.role === 'admin'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedUserId(user.user_id);
                          setNewRole(user.role);
                          setMessage('');
                        }}
                        className="px-4 py-2 rounded-lg bg-gray-700 text-white font-medium 
                        hover:bg-gray-600 hover:shadow-lg hover:shadow-blue-500/20 
                        transition-all duration-300 group relative"
                      >
                        <span className="absolute inset-0 rounded-lg border-2 border-blue-500/0 
                        group-hover:border-blue-500/50 transition-all duration-300"></span>
                        Edit Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Role Update Form */}
        {selectedUserId && (
          <form
            onSubmit={handleRoleUpdate}
            className="mt-8 p-6 bg-gray-800 rounded-lg space-y-4"
          >
            <h4 className="text-lg font-semibold text-white">
              Update Role for{' '}
              <span className="text-blue-400">{selectedUserId}</span>
            </h4>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full sm:w-40 bg-gray-700 text-white rounded-lg px-3 py-2 
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2 rounded-lg bg-gray-700 text-white font-medium 
                hover:bg-gray-600 hover:shadow-lg hover:shadow-blue-500/20 
                transition-all duration-300 group relative"
              >
                <span className="absolute inset-0 rounded-lg border-2 border-blue-500/0 
                group-hover:border-blue-500/50 transition-all duration-300"></span>
                Update Role
              </button>
            </div>
            {message && (
              <p
                className={`text-center font-medium ${
                  message.includes('Failed') ? 'text-red-500' : 'text-green-500'
                }`}
              >
                {message}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

export default AdminPage;