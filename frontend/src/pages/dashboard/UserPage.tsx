import { FaUserInjured, FaFileMedical, FaCalendarAlt, FaFileInvoiceDollar, FaPills, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import PageAccessTemplate from '../../components/dashboard/page-access/PageAccessTemplate';

const UserPage = () => {
  return (
    <div className="pageTemplate2 bg-[#F0F4F8]">
      <PageAccessTemplate color="#FEC223" icon={FaUserInjured} role="Patient" />
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Medical Records Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#4A90E2]">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-[#4A90E2]">
              <FaFileMedical className="mr-3 text-3xl" /> My Medical Records
            </h2>
            <p className="text-gray-700 mb-4">
              View and access your medical records securely and confidentially.
            </p>
            <Link to="/patient/medical-records" className="text-white bg-[#4A90E2] hover:bg-[#357ABD] py-2 px-4 rounded-lg">
              View Records
            </Link>
          </div>

          {/* Appointments Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#50E3C2]">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-[#50E3C2]">
              <FaCalendarAlt className="mr-3 text-3xl" /> My Appointments
            </h2>
            <p className="text-gray-700 mb-4">
              Check your upcoming appointments and schedule new ones.
            </p>
            <Link to="/patient/appointments" className="text-white bg-[#50E3C2] hover:bg-[#3D8B74] py-2 px-4 rounded-lg">
              View Appointments
            </Link>
          </div>

          {/* Billing Information Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#F5A623]">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-[#F5A623]">
              <FaFileInvoiceDollar className="mr-3 text-3xl" /> Billing Information
            </h2>
            <p className="text-gray-700 mb-4">
              Access your billing statements, payment history, and make payments.
            </p>
            <Link to="/patient/billing" className="text-white bg-[#F5A623] hover:bg-[#CF8C2F] py-2 px-4 rounded-lg">
              View Billing
            </Link>
          </div>

          {/* Prescriptions Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#D0021B]">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-[#D0021B]">
              <FaPills className="mr-3 text-3xl" /> Prescriptions
            </h2>
            <p className="text-gray-700 mb-4">
              Review your current and past prescriptions and request refills.
            </p>
            <Link to="/patient/prescriptions" className="text-white bg-[#D0021B] hover:bg-[#B72D1F] py-2 px-4 rounded-lg">
              View Prescriptions
            </Link>
          </div>

          {/* Messages Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-[#4A90E2]">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-[#4A90E2]">
              <FaEnvelope className="mr-3 text-3xl" /> Messages
            </h2>
            <p className="text-gray-700 mb-4">
              Communicate with your doctor or medical staff securely.
            </p>
            <Link to="/patient/messages" className="text-white bg-[#4A90E2] hover:bg-[#357ABD] py-2 px-4 rounded-lg">
              View Messages
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserPage;
