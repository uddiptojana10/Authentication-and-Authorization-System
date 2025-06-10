import { Outlet, Link } from 'react-router-dom';
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';
import { useAuth0 } from '@auth0/auth0-react';

function RootLayout() {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-400">Auth App</h1>
          <div className="flex space-x-6 items-center">
            <Link to="/" className="text-gray-300 hover:text-blue-400 font-medium transition-colors duration-150">
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/profile"
                  className="text-gray-300 hover:text-blue-400 font-medium transition-colors duration-150"
                >
                  Profile
                </Link>
                <Link
                  to="/admin"
                  className="text-gray-300 hover:text-blue-400 font-medium transition-colors duration-150"
                >
                  Admin
                </Link>
              </>
            )}
            {isAuthenticated ? <LogoutButton /> : <LoginButton />}
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default RootLayout;