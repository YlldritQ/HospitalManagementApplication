import React, { useEffect, useState } from "react";
import {
  createAppointment,
  deleteAppointment,
  getAppointmentByUserId,
  getAppointments,
  updateAppointment,
} from "../../services/appointmentService";
import { AppointmentDto, CUAppointmentDto } from "../../types/appointmentTypes";
import useAuth from "../../hooks/useAuth.hook";
import CreateAppointmentModal from "../../components/modals/CreateAppointmentModal";
import EditAppointmentModal from "../../components/modals/EditAppointmentModal";
import { DoctorDto } from "../../types/doctorTypes";
import { PatientDto } from "../../types/patientTypes";
import { RoomDto } from "../../types/roomTypes";
import { getDoctors } from "../../services/doctorService";
import { getAllRooms } from "../../services/roomService";
import { getAllPatients } from "../../services/patientService";
import toast from "react-hot-toast";

const AppointmentsPage: React.FC = () => {
  const { user: loggedInUser } = useAuth(); // Get the logged-in user
  const userId = loggedInUser?.id;
  const userRole = loggedInUser?.roles; // Assuming role is part of the loggedInUser object
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentDto | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [patients, setPatients] = useState<PatientDto[]>([]);
  const [doctors, setDoctors] = useState<DoctorDto[]>([]);
  const [rooms, setRooms] = useState<RoomDto[]>([]);

  // Fetch appointments based on user role
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const [allPatients, allDoctors, allRooms] = await Promise.all([
          getAllPatients(),
          getDoctors(),
          getAllRooms(),
        ]);
        setPatients(allPatients);
        setDoctors(allDoctors);
        setRooms(allRooms);
        if (userRole?.includes("Admin")) {
          const allAppointments = await getAppointments();
          setAppointments(allAppointments);
        } else if (
          userRole?.includes("Doctor") ||
          userRole?.includes("Patient")
        ) {
          const userAppointments = await getAppointmentByUserId(userId);
          setAppointments(userAppointments);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAppointments();
  }, [userId, userRole]);

  const fetchAppointments = async () => {
    if (userRole?.includes("Admin")) {
      const allAppointments = await getAppointments();
      setAppointments(allAppointments);
    } else if (userRole?.includes("Doctor") || userRole?.includes("Patient")) {
      const userAppointments = await getAppointmentByUserId(userId);
      setAppointments(userAppointments);
    }
  };
  const findPatientName = (patientId: number) => {
    const patient = patients.find((p) => p.patientId === patientId);
    return patient
      ? `${patient.firstName} ${patient.lastName}`
      : "Unknown Patient";
  };

  const findDoctorName = (doctorId: number) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    return doctor ? `${doctor.firstName} ${doctor.lastName}` : "Unknown Doctor";
  };

  const findRoomNumber = (roomId: number) => {
    const room = rooms.find((r) => r.id === roomId);
    return room ? room.roomNumber : "Unknown Room";
  };

  // Handle creating an appointment
  const handleCreateAppointment = async (appointment: CUAppointmentDto) => {
    let result = await createAppointment(appointment);
    if(result.isSucceed){
      toast.success(result.message);
    }
    else{
      toast.error(result.message);
    }
    setModalOpen(false);
    fetchAppointments(); // Refresh appointments list after creation
  };

  // Handle editing an appointment
  const handleEditAppointment = async (appointment: CUAppointmentDto) => {
    if (selectedAppointment) {
      let result = await updateAppointment(selectedAppointment.id, appointment);
      if(result.isSucceed){
        toast.success(result.message);
      }
      else{
        toast.error(result.message);
      }
      setModalOpen(false);
      fetchAppointments(); // Refresh appointments list after editing
    }
  };

  // Handle deleting an appointment
  const handleDeleteAppointment = async (id: number) => {
    await deleteAppointment(id);
    fetchAppointments(); // Refresh appointments list after deletion
  };

  // Open the "Create Appointment" modal
  const openCreateModal = () => {
    setModalMode("create");
    setSelectedAppointment(null);
    setModalOpen(true);
  };

  // Open the "Edit Appointment" modal
  const openEditModal = (appointment: AppointmentDto) => {
    setModalMode("edit");
    setSelectedAppointment(appointment);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col items-start justify-start p-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 min-h-screen w-full">
      <h1 className="text-3xl font-bold text-white mb-8">Appointments</h1>
      
      {userRole?.includes("Admin") && (
        <div className="mb-8 w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Admin View</h2>

          {/* Create Appointment Button */}
          <div className="mb-6">
            <button
              onClick={openCreateModal} // Open the create modal
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Appointment
            </button>
          </div>

          {/* Appointments Table */}
          <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  Appointment Date
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  Patient ID
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  Doctor ID
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  Room ID
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  Status
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="bg-gray-800 text-white">
                  <td className="py-4 px-6">
                    {new Date(appointment.appointmentDate).toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    {findPatientName(appointment.patientId)}
                  </td>
                  <td className="py-4 px-6">
                    {findDoctorName(appointment.doctorId)}
                  </td>
                  <td className="py-4 px-6">
                    {findRoomNumber(appointment.roomId)}
                  </td>
                  <td className="py-4 px-6">{appointment.status}</td>
                  <td className="py-4 px-6 flex space-x-2">
                    {/* Edit Button */}
                    <button
                      onClick={() => openEditModal(appointment)} // Open the edit modal
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
                    >
                      Edit
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteAppointment(appointment.id)} // Delete appointment
                      className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {userRole?.includes("Patient") && (
        <div className="mb-8 w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Patient View</h2>

          {/* Create Appointment Button */}
          <div className="mb-6">
            <button
              onClick={openCreateModal} // Open the create modal
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Appointment
            </button>
          </div>

          {/* Appointments Table */}
          <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  Appointment Date
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  Patient ID
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  Doctor ID
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  Room ID
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  Status
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="bg-gray-800 text-white">
                  <td className="py-4 px-6">
                    {new Date(appointment.appointmentDate).toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    {findPatientName(appointment.patientId)}
                  </td>
                  <td className="py-4 px-6">
                    {findDoctorName(appointment.doctorId)}
                  </td>
                  <td className="py-4 px-6">
                    {findRoomNumber(appointment.roomId)}
                  </td>
                  <td className="py-4 px-6">{appointment.status}</td>
                  <td className="py-4 px-6 flex space-x-2">
                    {/* Edit Button */}
                    <button
                      onClick={() => openEditModal(appointment)} // Open the edit modal
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
                    >
                      Edit
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteAppointment(appointment.id)} // Delete appointment
                      className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {userRole?.includes("Doctor") && (
        <div className="mb-8 w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Doctor View</h2>

          {/* Appointments Table */}
          <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  Appointment Date
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  Patient ID
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  Doctor ID
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  Room ID
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  Status
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="bg-gray-800 text-white">
                  <td className="py-4 px-6">
                    {new Date(appointment.appointmentDate).toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    {findPatientName(appointment.patientId)}
                  </td>
                  <td className="py-4 px-6">
                    {findDoctorName(appointment.doctorId)}
                  </td>
                  <td className="py-4 px-6">
                    {findRoomNumber(appointment.roomId)}
                  </td>
                  <td className="py-4 px-6">{appointment.status}</td>
                  <td className="py-4 px-6 flex space-x-2">
                    {/* Edit Button */}
                    <button
                      onClick={() => openEditModal(appointment)} // Open the edit modal
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
                    >
                      Edit
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteAppointment(appointment.id)} // Delete appointment
                      className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for creating/editing appointments */}
      {modalMode === "create" ? (
        <CreateAppointmentModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreateAppointment}
        />
      ) : (
        <EditAppointmentModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleEditAppointment}
          appointment={selectedAppointment!}
        />
      )}
    </div>
  );
};

export default AppointmentsPage;
