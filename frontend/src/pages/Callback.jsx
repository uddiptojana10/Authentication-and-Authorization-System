import { useEffect } from 'react';
     import { useAuth0 } from '@auth0/auth0-react';
     import { useNavigate } from 'react-router-dom';

     function Callback() {
       const { isLoading, error } = useAuth0();
       const navigate = useNavigate();

       useEffect(() => {
         if (!isLoading && !error) {
           navigate('/profile');
         }
       }, [isLoading, error, navigate]);

       if (error) {
         return <div className="text-center text-red-500">Error: {error.message}</div>;
       }

       return <div className="text-center">Processing...</div>;
     }

     export default Callback;