import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDoctors,
  getRoomsAssignedToDoctor,
  getDoctorByUserId,
} from "../../services/doctorService";

import { toast } from "react-hot-toast";
import {
  getAppointments,
  deleteAppointment,
  getAppointmentById,
  createAppointment,
  getAppointmentsByDoctorId,
} from "../../services/appointmentService";
import { AppointmentDto, CUAppointmentDto } from "../../types/appointmentTypes";
import { getAllPatients } from "../../services/patientService";
import { RoomDto } from "../../types/roomTypes";
import { PatientDto } from "../../types/patientTypes";
import useAuth from "../../hooks/useAuth.hook";
import { DoctorDto } from "../../types/doctorTypes";
const Appointment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [, setLoading] = useState(true);
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [patients, setPatients] = useState<PatientDto[]>([]);
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDto | null>(null);
  const [isCreatingAppointment, setIsCreatingAppointment] = useState<boolean>(false);
  const [formData, setFormData] = useState<CUAppointmentDto>({
    appointmentDate: new Date(),
    patientId: 0,
    doctorId: 0,
    status: "Scheduled",
    roomId: 0,
  });
  const [appointmentTime, setAppointmentTime] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [doctors, setDoctors] = useState<DoctorDto[]>([]);

  // Fetching doctor and appointments based on user ID
  const fetchAppointmentsBasedOnRole = async () => {
    if (!user?.id) return; // Ensure user is logged in
  
    try {
      setLoading(true); // Start loading before fetching data
  
      if (user.roles.includes("Admin")) {
        // Fetch all appointments for admin
        const fetchedAppointments = await getAppointments();
        setAppointments(fetchedAppointments);
      } else if (user.roles.includes("Doctor")) {
        // Fetch appointments by doctor ID
        const doctor = await getDoctorByUserId(user.id);
        if (doctor) {
          const fetchedAppointments = await getAppointmentsByDoctorId(doctor.id);
          setAppointments(fetchedAppointments);
        } else {
          setError("Doctor not found for the current user.");
        }
      } else {
        setError("Unauthorized access.");
      }
    } catch (err) {
      // More specific error logging
      console.error(err); // Log the error for debugging
      if (err instanceof Error) {
        toast.error(`Error: ${err.message}`);
        setError(`Error: ${err.message}`);
      } else {
        toast.error("An unknown error occurred.");
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false); // Stop loading once data is fetched
    }
  };
  
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsData = await getAllPatients();
        console.log("Fetched Patients: ", patientsData);
        setPatients(patientsData);
      } catch (err) {
        toast.error("Failed to fetch patients");
      }
    };
  
    const fetchDoctors = async () => {
      try {
        setLoading(true); // Start loading
        const doctorsData = await getDoctors();
        console.log("Fetched Doctors: ", doctorsData);
        setDoctors(doctorsData);
      } catch (err) {
        //handleError(err, "Failed to fetch doctors");
      } finally {
        setLoading(false); // Stop loading
      }
    };
  
    const fetchAppointments = async () => {
      await fetchAppointmentsBasedOnRole();
    };
  
    fetchPatients();
    fetchDoctors();
    fetchAppointments();
  }, [id, user?.id, user?.roles]);
  
  
  

  // Handling appointment creation
  const handleCreateAppointment = async () => {
    if (!(formData.appointmentDate instanceof Date) || !appointmentTime) {
      toast.error('Invalid date or time.');
      return;
    }
  
    const [year, month, day] = formData.appointmentDate.toISOString().split("T")[0].split("-");
    const [hours, minutes] = appointmentTime.split(":");
  
    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10) - 1;
    const dayNum = parseInt(day, 10);
    const hoursNum = parseInt(hours, 10);
    const minutesNum = parseInt(minutes, 10);
  
    const appointmentDateTime = new Date(yearNum, monthNum, dayNum, hoursNum, minutesNum);
  
    const response = await createAppointment({
      ...formData,
      appointmentDate: appointmentDateTime,
    });
  
    if (response.isSucceed) {
      setIsCreatingAppointment(false);
      const updatedAppointments = await getAppointments();
      const transformedAppointments = updatedAppointments.map((item: any) => ({
        id: item.id,
        appointmentDate: new Date(item.appointmentDate),
        patientId: item.patientId,
        doctorId: item.doctorId,
        status: item.status,
        roomId: item.roomId,
      }));
      setAppointments(transformedAppointments);
      toast.success(`Appointment created: ${response.message}`);
    } else {
      toast.error(`Insert failed: ${response.message}`);
    }
  };

  // Handling appointment deletion
  const handleDeleteAppointment = async (id: number) => {
    try {
      await deleteAppointment(id);
      setAppointments(
        appointments.filter((appointment) => appointment.id !== id)
      );
    } catch (err) {
      toast.error("Failed to delete appointment");
    }
  };

  // Handling changes in doctor selection
  const handleDoctorChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const doctorId = Number(e.target.value);
    setFormData((prev) => ({ ...prev, doctorId }));

    if (doctorId) {
      try {
        const doctorRooms = await getRoomsAssignedToDoctor(doctorId);
        setRooms(doctorRooms);
        setFormData((prev) => ({ ...prev, roomId: 0 })); // Reset roomId when doctor changes
      } catch (err) {
        toast.error("Failed to fetch rooms for the selected doctor");
      }
    }
  };

  // Handling changes in form inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "appointmentDate" ? new Date(value) : Number(value) || value,
    }));
  };

  // Handling changes in date input
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      appointmentDate: new Date(value),
    }));
  };

  

  // Viewing appointment details
  const handleViewDetails = async (id: number) => {
    try {
      const appointment = await getAppointmentById(id);
      if (appointment) {
        const transformedAppointment: AppointmentDto = {
          ...appointment,
          appointmentDate: new Date(appointment.appointmentDate),
        };
        setSelectedAppointment(transformedAppointment);
        navigate('/appointment');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to fetch appointment details.");
      }
    }
  };

  if (error) return <div>{error}</div>;


  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow-md">
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Manage Appointments</h2>

        <button
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
          onClick={() => setIsCreatingAppointment(true)}
        >
          Create New Appointment
        </button>

        {isCreatingAppointment && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              New Appointment Form
            </h2>

            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="appointmentDate"
            >
              Appointment Date
            </label>
            <input
              type="date"
              id="appointmentDate"
              name="appointmentDate"
              value={formData.appointmentDate.toISOString().split("T")[0]} 
              onChange={handleDateChange}
              placeholder="Select date"
              title="Select the appointment date"
              className="border rounded p-2 mb-4 w-full"
            />
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="appointmentTime"
            >
              Appointment Time
            </label>
            <input
              type="time"
              id="appointmentTime"
              name="appointmentTime"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              placeholder="Select time"
              title="Select the appointment time"
              className="border rounded p-2 mb-4 w-full"
            />

            {/* Patient Dropdown */}
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="patientId"
            >
              Select Patient
            </label>
            <select
              id="patientId"
              name="patientId"
              value={formData.patientId}
              onChange={handleInputChange}
              className="border rounded p-2 mb-4 w-full"
            >
              <option value="">Select a patient</option>
              {patients.map((patient) => (
                <option key={patient.patientId} value={patient.patientId}>
                  {patient.firstName} {patient.lastName}
                </option>
              ))}
            </select>

            {/* Doctor Dropdown */}
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="doctorId"
            >
              Select Doctor
            </label>
            <select
              id="doctorId"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleDoctorChange}
              className="border rounded p-2 mb-4 w-full"
            >
              <option value="">Select a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.firstName} {doctor.lastName}
                </option>
              ))}
            </select>

            {/* Room Dropdown */}
            {formData.doctorId && (
              <>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="roomId"
                >
                  Select Room
                </label>
                <select
                  id="roomId"
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleInputChange}
                  className="border rounded p-2 mb-4 w-full"
                >
                  <option value="">Select a room</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.roomNumber}
                    </option>
                  ))}
                </select>
              </>
            )}

            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="status"
            >
              Status
            </label>
            <input
              type="text"
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              placeholder="Enter Status"
              title="Enter Appointment Status"
              className="border rounded p-2 mb-4 w-full"
            />

            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200"
              onClick={handleCreateAppointment}
            >
              Save Appointment
            </button>
            <button
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-200"
              onClick={() => setIsCreatingAppointment(false)}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Appointments Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-6 border rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Appointment #{appointment.id}
              </h2>
              <p className="text-sm text-gray-600">
                Date: {appointment.appointmentDate.toDateString()}
              </p>
              <p className="text-sm text-gray-600">
                Date and Time:{" "}
                {new Date(appointment.appointmentDate).toLocaleString()}
              </p>

              <p className="text-sm text-gray-600">
                Patient ID: {appointment.patientId}
              </p>
              <p className="text-sm text-gray-600">
                Doctor ID: {appointment.doctorId}
              </p>
              <p className="text-sm text-gray-600">
                Room: {appointment.roomId}
              </p>
              <p className="text-sm text-gray-600">
                Status: {appointment.status}
              </p>
              <div className="flex justify-between mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
                  onClick={() => handleViewDetails(appointment.id)}
                >
                  View Details
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
                  onClick={() => handleDeleteAppointment(appointment.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedAppointment && (
  <div className="mt-8 p-4 border rounded bg-gray-100">
    <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
    <p>
      <strong>ID:</strong> {selectedAppointment.id}
    </p>
    <p>
      <strong>Date:</strong> {selectedAppointment.appointmentDate.toDateString()}
    </p>
    <p>
      <strong>Time:</strong> {selectedAppointment.appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </p>
    <p>
      <strong>Patient ID:</strong> {selectedAppointment.patientId}
    </p>
    <p>
      <strong>Doctor ID:</strong> {selectedAppointment.doctorId}
    </p>
    <p>
      <strong>Room ID:</strong> {selectedAppointment.roomId}
    </p>
    <p>
      <strong>Status:</strong> {selectedAppointment.status}
    </p>
    <button
      className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-200"
      onClick={() => setSelectedAppointment(null)} // Close details view
    >
      Close
    </button>
  </div>
)}

      </div>
    </div>
  );
};

export default Appointment;
