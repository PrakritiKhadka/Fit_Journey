import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/user'; 

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { googleAuth } = useUserStore();

  useEffect(() => {
    const handleGoogleAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const credential = urlParams.get('credential'); 

      if (credential) {
        try {
          await googleAuth(credential);
          navigate('/FitJourneyDashboard');
        } catch (error) {
          console.error('Error processing Google login:', error);
          navigate('/LoginPage');
        }
      } else {
        navigate('/LoginPage');
      }
    };

    handleGoogleAuth();
  }, [googleAuth, navigate]);

  return <div>Loading...</div>; // Or you can show a loading spinner
};

export default AuthCallbackPage;
