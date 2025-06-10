import Profile from '../components/Profile';
     import { useAuth0 } from '@auth0/auth0-react';

     function ProfilePage() {
       const { isAuthenticated } = useAuth0();

       if (!isAuthenticated) {
         return (
           <div className="text-center">
             <p className="text-red-500">Please log in to view your profile.</p>
           </div>
         );
       }

       return (
         <div>
           <h2 className="text-2xl font-bold mb-4 text-center">Your Profile</h2>
           <Profile />
         </div>
       );
     }

     export default ProfilePage;