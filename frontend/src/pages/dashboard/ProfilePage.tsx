import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.hook';

const ProfilePage: React.FC = () => {
  const { user } = useAuth(); // Get user data from the auth context
  const navigate = useNavigate();

  // Render a loading message if user data is not available yet
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  const handleEditClick = (id: string) => {
    navigate(`/dashboard/updateProfile/:${id}`); // Navigate to the edit profile page
  };

  // Render the profile information
  return (
    <div className="container mx-auto my-12 px-4 md:px-12">
      <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 border border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-8">Profile Page</h1>
        
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
            <strong className="text-lg text-gray-700 w-full sm:w-1/3 mb-2 sm:mb-0">Username:</strong>
            <span className="text-lg text-gray-600 w-full sm:w-2/3">{user.userName}</span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
            <strong className="text-lg text-gray-700 w-full sm:w-1/3 mb-2 sm:mb-0">First Name:</strong>
            <span className="text-lg text-gray-600 w-full sm:w-2/3">{user.firstName}</span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
            <strong className="text-lg text-gray-700 w-full sm:w-1/3 mb-2 sm:mb-0">Last Name:</strong>
            <span className="text-lg text-gray-600 w-full sm:w-2/3">{user.lastName}</span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
            <strong className="text-lg text-gray-700 w-full sm:w-1/3 mb-2 sm:mb-0">Email:</strong>
            <span className="text-lg text-gray-600 w-full sm:w-2/3">{user.email}</span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
            <strong className="text-lg text-gray-700 w-full sm:w-1/3 mb-2 sm:mb-0">Gender:</strong>
            <span className="text-lg text-gray-600 w-full sm:w-2/3">{user.gender}</span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
            <strong className="text-lg text-gray-700 w-full sm:w-1/3 mb-2 sm:mb-0">Address:</strong>
            <span className="text-lg text-gray-600 w-full sm:w-2/3">{user.address}</span>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
            <strong className="text-lg text-gray-700 block mb-3">Roles:</strong>
            <div className="mt-2 flex flex-wrap gap-3">
              {user.roles.map((role, index) => (
                <span
                  key={index}
                  className="inline-block bg-indigo-600 text-white text-sm font-medium py-1 px-4 rounded-full shadow-md"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button 
              onClick={() => handleEditClick(user.id)} 
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
