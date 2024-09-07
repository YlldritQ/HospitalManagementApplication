import { CiUser } from "react-icons/ci";
import { FaClipboardList, FaStethoscope, FaSyringe, FaUserInjured } from "react-icons/fa";
import { MdAdminPanelSettings, MdOutlineMedicalServices } from "react-icons/md";
import { TbMessages } from "react-icons/tb";
import { AiOutlineCalendar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.hook";

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = (url: string) => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    navigate(url);
  };

  return (
    <div className="bg-white shadow-lg w-64 p-6 min-h-screen">
      <div className="flex items-center gap-4 p-4">
        <CiUser className="w-10 h-10 text-blue-600" />
        <div>
          <h4 className="text-lg font-semibold text-gray-800">{user?.firstName} {user?.lastName}</h4>
          <p className="text-sm text-gray-500">{user?.role}</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-4">Menu</div>
        <div className="space-y-4">
          <button 
            onClick={() => handleClick('/dashboard/admin')} 
            className="flex items-center gap-4 text-gray-700 hover:bg-blue-100 p-3 rounded-lg w-full"
          >
            <MdAdminPanelSettings className="text-blue-600 w-6 h-6" />
            <span className="font-medium">Admin Dashboard</span>
          </button>

          <button 
            onClick={() => handleClick('/dashboard/appointment')} 

            className="flex items-center gap-4 text-gray-700 hover:bg-blue-100 p-3 rounded-lg w-full"
          >
            <AiOutlineCalendar className="text-green-600 w-6 h-6" />
            <span className="font-medium">Appointments</span>
          </button>

          <button 
            onClick={() => handleClick('/user/medical-records')} 
            className="flex items-center gap-4 text-gray-700 hover:bg-blue-100 p-3 rounded-lg w-full"
          >
            <MdOutlineMedicalServices className="text-orange-600 w-6 h-6" />
            <span className="font-medium">Medical Records</span>
          </button>

          <button 
            onClick={() => handleClick('/user/messages')} 
            className="flex items-center gap-4 text-gray-700 hover:bg-blue-100 p-3 rounded-lg w-full"
          >
            <TbMessages className="text-purple-600 w-6 h-6" />
            <span className="font-medium">Messages</span>
          </button>

          <button 
            onClick={() => handleClick('/user/prescriptions')} 
            className="flex items-center gap-4 text-gray-700 hover:bg-blue-100 p-3 rounded-lg w-full"
          >
            <FaClipboardList className="text-red-600 w-6 h-6" />
            <span className="font-medium">Prescriptions</span>
          </button>

          <button 
            onClick={() => handleClick('/dashboard/doctor')} 
            className="flex items-center gap-4 text-gray-700 hover:bg-blue-100 p-3 rounded-lg w-full"
          >
            <FaStethoscope className="text-teal-600 w-6 h-6" />
            <span className="font-medium">Doctor Dashboard</span>
          </button>

          <button 
            onClick={() => handleClick('/dashboard/nurse')} 
            className="flex items-center gap-4 text-gray-700 hover:bg-blue-100 p-3 rounded-lg w-full"
          >
            <FaSyringe className="text-teal-600 w-6 h-6" />
            <span className="font-medium">Nurse Dashboard</span>
          </button>

          <button 
            onClick={() => handleClick('/dashboard/user')} 
            className="flex items-center gap-4 text-gray-700 hover:bg-blue-100 p-3 rounded-lg w-full"
          >
            <FaUserInjured className="text-teal-600 w-6 h-6" />
            <span className="font-medium">User Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

