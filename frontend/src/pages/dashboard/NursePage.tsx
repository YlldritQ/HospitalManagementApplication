// src/pages/dashboard/NursePage.tsx
import React from 'react';
import PageAccessTemplate from '../../components/dashboard/page-access/PageAccessTemplate';
import { FaUserNurse, FaListUl } from 'react-icons/fa';
import Button from '../../components/general/Button';
import { useNavigate } from 'react-router-dom';

const NursePage = () => {
  const navigate = useNavigate();

  const handleButtonClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="pageTemplate2 bg-[#F0F4F8]">
      <PageAccessTemplate color='#3b3549' icon={FaUserNurse} role='Nurse' />

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Patients List Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#4A90E2]">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-[#4A90E2]">
              <FaListUl className="mr-3 text-3xl" /> Patient List
            </h2>
            <p className="text-gray-700 mb-4">
              View and manage patients assigned to you.
            </p>
            <Button 
              label="View Patients" 
              onClick={() => handleButtonClick('/nurse/patients')} 
              variant="primary" 
              type="button" 
              className="text-white bg-[#4A90E2] hover:bg-[#357ABD]"
            />
          </div>

          {/* Appointments Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#50E3C2]">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-[#50E3C2]">
              <FaListUl className="mr-3 text-3xl" /> Appointment Schedule
            </h2>
            <p className="text-gray-700 mb-4">
              Check your upcoming appointments and manage your schedule efficiently.
            </p>
            <Button 
              label="View Appointments" 
              onClick={() => handleButtonClick('/nurse/appointments')} 
              variant="primary" 
              type="button" 
              className="text-white bg-[#50E3C2] hover:bg-[#3D8B74]"
            />
          </div>

          {/* Notifications Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#F5A623]">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-[#F5A623]">
              <FaListUl className="mr-3 text-3xl" /> Notifications
            </h2>
            <p className="text-gray-700 mb-4">
              Stay updated with important notifications relevant to your practice.
            </p>
            <Button 
              label="View Notifications" 
              onClick={() => handleButtonClick('/nurse/notifications')} 
              variant="primary" 
              type="button" 
              className="text-white bg-[#F5A623] hover:bg-[#CF8C2F]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NursePage;
