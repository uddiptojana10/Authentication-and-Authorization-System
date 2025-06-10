import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';

function Home() {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gradient-to-r from-gray-800 to-blue-900 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Welcome to Auth App
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 font-light">
            Securely manage your account with Auth0 and explore role-based access control.
          </p>
          <div className="flex justify-center gap-4">
            {isAuthenticated ? (
              <>
                <a
                  href="/profile"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  View Profile
                </a>
                <LogoutButton />
              </>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
            <h3 className="text-xl font-semibold mb-2">Secure Authentication</h3>
            <p className="text-gray-400 font-light">
              Powered by Auth0, ensuring safe and reliable user login.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
            <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
            <p className="text-gray-400 font-light">
              Manage users with admin or user roles via a secure backend.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
            <h3 className="text-xl font-semibold mb-2">Modern Design</h3>
            <p className="text-gray-400 font-light">
              A sleek, dark-themed UI for a seamless user experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;