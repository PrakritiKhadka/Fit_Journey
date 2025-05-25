// import React from 'react';
// import { GoogleLogin } from 'react-google-login';
// import useUserStore from '../store/user';
// import { useNavigate } from 'react-router-dom';

// const GoogleAuthButton = () => {
//     const { googleAuth, isLoading } = useUserStore();
//     const navigate = useNavigate();
  
//     // Proper Zustand state management
//     const handleGoogleLogin = async (credential) => {
//       try {
//         await googleAuth(credential);
//         navigate('/FitJourneyDashboard');
//       } catch (error) {
//         console.error('Google login failed:', error);
//       }
//     };
  
//     return (
//       <GoogleOAuthProvider clientId={import.meta.env.REACT_APP_GOOGLE_CLIENT_ID}>
//         <GoogleLogin
//           onSuccess={(credentialResponse) => {
//             handleGoogleLogin(credentialResponse.credential);
//           }}
//           onError={() => console.error('Login Failed')}
//           useOneTap
//           text="signup_with"
//         />
//       </GoogleOAuthProvider>
//     );
// };

// export default GoogleAuthButton