import PageAccessTemplate from '../../components/dashboard/page-access/PageAccessTemplate';
import { FaUserShield, FaCogs, FaChartLine, FaBell } from "react-icons/fa";
import { Link } from 'react-router-dom';

const AdminPage = () => {
  return (
    <div className="pageTemplate2 bg-gray-100">
      <PageAccessTemplate color="#1E3A8A" icon={FaUserShield} role="Admin">
        <div className="admin-dashboard p-6">
          <h1 className="text-3xl font-bold mb-6 text-blue-700">Admin Dashboard</h1>
          <div className="admin-widgets grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/admin/user-management" className="widget bg-white text-blue-800 p-4 rounded-md shadow-lg flex items-center">
              <FaUserShield className="text-3xl mr-4" />
              <span className="text-xl font-semibold">User Management</span>
            </Link>
            <Link to="/admin/system-settings" className="widget bg-white text-green-800 p-4 rounded-md shadow-lg flex items-center">
              <FaCogs className="text-3xl mr-4" />
              <span className="text-xl font-semibold">System Settings</span>
            </Link>
            <Link to="/admin/reports" className="widget bg-white text-orange-800 p-4 rounded-md shadow-lg flex items-center">
              <FaChartLine className="text-3xl mr-4" />
              <span className="text-xl font-semibold">Reports & Analytics</span>
            </Link>
            <Link to="/admin/notifications" className="widget bg-white text-red-800 p-4 rounded-md shadow-lg flex items-center">
              <FaBell className="text-3xl mr-4" />
              <span className="text-xl font-semibold">Notifications</span>
            </Link>
          </div>
        </div>
      </PageAccessTemplate>
    </div>
  );
};

export default AdminPage;
