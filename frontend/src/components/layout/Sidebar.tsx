import { CiUser } from "react-icons/ci";
import { FaClipboardList, FaStethoscope, FaSyringe, FaUserInjured } from "react-icons/fa";
import {  MdOutlineMedicalServices } from "react-icons/md";
import { TbMessages } from "react-icons/tb";
import { AiOutlineCalendar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.hook";
import { PATH_DASHBOARD } from "../../routes/paths";

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = (url: string) => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    navigate(url);
  };

  const renderLinksByRole = () => {
    if (!user?.roles) return null; // Ensure user and roles exist

    if (user.roles.includes("Admin")) {
      return (
        <>
          <button
            onClick={() => handleClick(PATH_DASHBOARD.usersManagement)}
            className="flex items-center gap-4 text-gray-700 hover:bg-blue-100 p-3 rounded-lg w-full"
          >
            <MdOutlineMedicalServices className="text-orange-600 w-6 h-6" />
            <span className="font-medium">User Management</span>
          </button>

          <button
            onClick={() => handleClick(PATH_DASHBOARD.patientList)}
            className="flex items-center gap-4 text-gray-700 hover:bg-blue-100 p-3 rounded-lg w-full"
          >
            <FaClipboardList className="text-red-600 w-6 h-6" />
            <span className="font-medium">Patients List</span>
          </button>

          <button
            onClick={() => handleClick(PATH_DASHBOARD.doctorList)}
            className="flex items-center gap-4 text-gray-700 hover:bg-blue-100 p-3 rounded-lg w-full"
          >
            <FaStethoscope className="text-teal-600 w-6 h-6" />
            <span className="font-medium">Doctors List</span>
          </button>

          <button
            onClick={() => handleClick(PATH_DASHBOARD.nurseList)}
            className="flex items-center gap-4 text-gray-700 hover:bg-blue-100 p-3 rounded-lg w-full"
          >
            <FaSyringe className="text-teal-600 w-6 h-6" />
            <span className="font-medium">Nurse List</span>
          </button>

          <button
            onClick={() => handleClick(PATH_DASHBOARD.myLogs)}
            className="flex items-center gap-4 text-gray-700 hover:bg-blue-100 p-3 rounded-lg w-full"
          >
            <AiOutlineCalendar className="text-green-600 w-6 h-6" />
            <span className="font-medium">My Logs</span>
          </button>

        </>
      );
    }

    if (user.roles.includes("Doctor")) {
      return (
        <>
          <button
            onClick={() => handleClick(PATH_DASHBOARD.doctor)}
            className="flex items-center gap-4 text-gray-700 hover:bg-blue-100 p-3 rounded-lg w-full"
          >
            <FaStethoscope className="text-teal-600 w-6 h-6" />
            <span className="font-medium">Doctor Dashboard</span>
          </button>

          <button
            onClick={() => handleClick(PATH_DASHBOARD.appointment)}
            className="flex items-center gap-4 text-gray-700 hover:bg-blue-100 p-3 rounded-lg w-full"
          >
            <AiOutlineCalendar className="text-green-600 w-6 h-6" />
            <span className="font-medium">Appointments</span>
          </button>

          <button
            onClick={() => handleClick(PATH_DASHBOARD.patientList)}
            className="flex items-center gap-4 text-gray-700 hover:bg-blue-100 p-3 rounded-lg w-full"
          >
            <FaClipboardList className="text-red-600 w-6 h-6" />
            <span className="font-medium">Patient List</span>
          </button>
        </>
      );
    }

    if (user.roles.includes("Nurse")) {
      return (
        <>
          <button
            onClick={() => handleClick(PATH_DASHBOARD.nurse)}
            className="flex items-center gap-4 text-gray-700 hover:bg-blue-100 p-3 rounded-lg w-full"
          >
            <FaSyringe className="text-teal-600 w-6 h-6" />
            <span className="font-medium">Nurse Dashboard</span>
          </button>

          <button
            onClick={() => handleClick(PATH_DASHBOARD.appointment)}
            className="flex items-center gap-4 text-gray-700 hover:bg-blue-100 p-3 rounded-lg w-full"
          >
            <AiOutlineCalendar className="text-green-600 w-6 h-6" />
            <span className="font-medium">Appointments</span>
          </button>

          <button
            onClick={() => handleClick(PATH_DASHBOARD.patientList)}
            className="flex items-center gap-4 text-gray-700 hover:bg-blue-100 p-3 rounded-lg w-full"
          >
            <FaClipboardList className="text-red-600 w-6 h-6" />
            <span className="font-medium">Patient List</span>
          </button>
        </>
      );
    }

    if (user.roles.includes("Patient")) {
      return (
        <>
          <button
            onClick={() => handleClick(PATH_DASHBOARD.user)}
            className="flex items-center gap-4 text-gray-700 hover:bg-blue-100 p-3 rounded-lg w-full"
          >
            <FaUserInjured className="text-teal-600 w-6 h-6" />
            <span className="font-medium">User Dashboard</span>
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
        </>
      );
    }

    return null;
  };

  return (
    <div className="bg-white shadow-lg w-64 p-6 min-h-screen">
      <div className="flex items-center gap-4 p-4">
        <CiUser className="w-10 h-10 text-blue-600" />
        <div>
          <h4 className="text-lg font-semibold text-gray-800">{user?.firstName} {user?.lastName}</h4>
          <p className="text-sm text-gray-500">{user?.roles?.[0]}</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-4">Menu</div>
        <div className="space-y-4">
          {renderLinksByRole()}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
