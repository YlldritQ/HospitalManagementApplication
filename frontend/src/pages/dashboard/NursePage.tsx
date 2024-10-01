// src/pages/dashboard/NursePage.tsx
import React, { useEffect, useState } from 'react';
import PageAccessTemplate from '../../components/dashboard/page-access/PageAccessTemplate';
import { FaUserNurse, FaListUl, FaBed } from 'react-icons/fa';
import Button from '../../components/general/Button';
import { useNavigate } from 'react-router-dom';
import { getNurseByUserId } from '../../services/nurseService'; // Ensure correct path
import { getRoomsAssignedToNurse } from '../../services/nurseService'; // Ensure correct path
import { RoomDto } from '../../types/roomTypes'; // Ensure correct path
import useAuth from '../../hooks/useAuth.hook';

const NursePage: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user: loggedInUser } = useAuth();
  const userId = loggedInUser?.id; // Replace with actual logged-in user ID or retrieve from context

  useEffect(() => {
    const fetchNurseAndRooms = async () => {
      try {
        // Fetch the nurse details
        const nurseData = await getNurseByUserId(userId);
        if (nurseData !== null) {
          const nurse = nurseData;
          //setNurse(nurse);

          // Fetch rooms assigned to the nurse
          const assignedRooms = await getRoomsAssignedToNurse(nurse.id);
          setRooms(assignedRooms);
        } else {
          setError('Nurse not found');
        }
      } catch (err) {
        console.error("Error fetching nurse or rooms:", err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchNurseAndRooms();
  }, [userId]);

  const handleButtonClick = (path: string) => {
    navigate(path);
  };

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

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
              onClick={() => handleButtonClick('/dashboard/patient-list')} 
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
              onClick={() => handleButtonClick('/dashboard/appointment')} 
              variant="primary" 
              type="button" 
              className="text-white bg-[#50E3C2] hover:bg-[#3D8B74]"
            />
          </div>


          {/* Assigned Rooms Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#7D3F5C]">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-[#7D3F5C]">
              <FaBed className="mr-3 text-3xl" /> Assigned Rooms
            </h2>
            {rooms.length > 0 ? (
              <ul className="list-disc pl-6 text-gray-700">
                {rooms.map(room => (
                  <li key={room.id} className="mb-2">
                    Room {room.roomNumber} (ID: {room.id})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">No rooms assigned.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NursePage;
