import PageAccessTemplate from '../../components/dashboard/page-access/PageAccessTemplate';
import { FaUsersCog, FaUserMd, FaListAlt, FaTools, FaUserNurse } from 'react-icons/fa';
import { MdNotifications } from 'react-icons/md';
import Button from '../../components/general/Button';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();

  const handleButtonClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="pageTemplate2 bg-[#F0F4F8]">
      <PageAccessTemplate color='#2C3E50' icon={FaUsersCog} role='Admin' />

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Patients List Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#3498DB]">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-[#3498DB]">
              <FaListAlt className="mr-3 text-3xl" /> Patients List
            </h2>
            <p className="text-gray-700 mb-4">
              View and manage the list of patients across the system.
            </p>
            <Button 
              label="View Patients" 
              onClick={() => handleButtonClick('/patients')} 
              variant="primary" 
              type="button" 
              className="text-white bg-[#3498DB] hover:bg-[#2980B9]"
            />
          </div>

          {/* Doctors List Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#2ECC71]">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-[#2ECC71]">
              <FaUserMd className="mr-3 text-3xl" /> Doctors List
            </h2>
            <p className="text-gray-700 mb-4">
              View and manage the list of doctors in the system.
            </p>
            <Button 
              label="View Doctors" 
              onClick={() => handleButtonClick('/dashboard/doctor-list')} 
              variant="primary" 
              type="button" 
              className="text-white bg-[#2ECC71] hover:bg-[#27AE60]"
            />
          </div>

          {/* My Logs Page Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#E67E22]">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-[#E67E22]">
              <FaTools className="mr-3 text-3xl" /> My Logs
            </h2>
            <p className="text-gray-700 mb-4">
              Access and review your personal logs and activities.
            </p>
            <Button 
              label="View Logs" 
              onClick={() => handleButtonClick('/dashboard/system-logs')} 
              variant="primary" 
              type="button" 
              className="text-white bg-[#E67E22] hover:bg-[#D35400]"
            />
          </div>

          {/* Nurse List Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#F39C12]">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-[#F39C12]">
              <FaUserNurse className="mr-3 text-3xl" /> Nurse List
            </h2>
            <p className="text-gray-700 mb-4">
              View and manage the list of nurses in the system.
            </p>
            <Button 
              label="View Nurses" 
              onClick={() => handleButtonClick('/nurses')} 
              variant="primary" 
              type="button" 
              className="text-white bg-[#F39C12] hover:bg-[#E67E22]"
            />
          </div>

          {/* User Management Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#9B59B6]">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-[#9B59B6]">
              <FaUsersCog className="mr-3 text-3xl" /> User Management
            </h2>
            <p className="text-gray-700 mb-4">
              Manage user accounts, roles, and permissions.
            </p>
            <Button 
              label="Manage Users" 
              onClick={() => handleButtonClick('/dashboard/users-management')} 
              variant="primary" 
              type="button" 
              className="text-white bg-[#9B59B6] hover:bg-[#8E44AD]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
