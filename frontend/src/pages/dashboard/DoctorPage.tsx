import PageAccessTemplate from '../../components/dashboard/page-access/PageAccessTemplate';
import { FaUserCog, FaCalendarAlt, FaUsers, FaFileMedical, FaBed } from 'react-icons/fa';
import { MdNotifications } from 'react-icons/md';
import Button from '../../components/general/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RoomDto } from '../../types/roomTypes';
import useAuth from '../../hooks/useAuth.hook';
import { getDoctorByUserId, getRoomsAssignedToDoctor } from '../../services/doctorService';

const DoctorPage: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user: loggedInUser } = useAuth();
  const userId = loggedInUser?.id; // Replace with actual logged-in user ID or retrieve from context

  useEffect(() => {
    const fetchNurseAndRooms = async () => {
      try {
        // Fetch the nurse details
        const doctorData = await getDoctorByUserId(userId);
        if (doctorData !== null) {
          const doctor = doctorData;

          // Fetch rooms assigned to the nurse
          const assignedRooms = await getRoomsAssignedToDoctor(doctor.id);
          setRooms(assignedRooms);
        } else {
          setError('Doctor not found');
        }
      } catch (err) {
        console.error("Error fetching nurse or rooms:", err);
        setError('Failed to fetch data');
      } 
    };

    fetchNurseAndRooms();
  }, [userId]);


  const handleButtonClick = (path: string) => {
    navigate(path);
  };

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  return (
    <div className="pageTemplate2 bg-[#F0F4F8]">
      <PageAccessTemplate color='#3b3549' icon={FaUserCog} role='Doctor' />

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Patients Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#4A90E2]">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-[#4A90E2]">
              <FaUsers className="mr-3 text-3xl" /> Patient List
            </h2>
            <p className="text-gray-700 mb-4">
              View and manage patients assigned to you. Ensure timely care and follow-ups.
            </p>
            <Button 
              label="View Patients" 
              onClick={() => handleButtonClick('/patients')} 
              variant="primary" 
              type="button" 
              className="text-white bg-[#4A90E2] hover:bg-[#357ABD]"
            />
          </div>

          {/* Appointments Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#50E3C2]">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-[#50E3C2]">
              <FaCalendarAlt className="mr-3 text-3xl" /> Appointment Schedule
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

          {/* Notifications Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#F5A623]">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-[#F5A623]">
              <MdNotifications className="mr-3 text-3xl" /> Notifications
            </h2>
            <p className="text-gray-700 mb-4">
              Stay updated with important notifications relevant to your practice.
            </p>
            <Button 
              label="View Notifications" 
              onClick={() => handleButtonClick('/notifications')} 
              variant="primary" 
              type="button" 
              className="text-white bg-[#F5A623] hover:bg-[#CF8C2F]"
            />
          </div>

          {/* Medical Records Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#D0021B]">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-[#D0021B]">
              <FaFileMedical className="mr-3 text-3xl" /> Medical Records
            </h2>
            <p className="text-gray-700 mb-4">
              Access and review patient medical records with ease and confidentiality.
            </p>
            <Button 
              label="View Records" 
              onClick={() => handleButtonClick('/records')} 
              variant="primary" 
              type="button" 
              className="text-white bg-[#D0021B] hover:bg-[#B72D1F]"
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

export default DoctorPage;
