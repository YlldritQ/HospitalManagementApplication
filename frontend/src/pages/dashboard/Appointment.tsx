import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDoctorById,
  getDoctors,
  getRoomsAssignedToDoctor,
  updateDoctor,
} from "../../services/doctorService";
import { CUDoctorDto, DoctorDto } from "../../types/doctorTypes";
import { toast } from "react-toastify";
import { DepartmentDto } from "../../types/departmentTypes";
import { getDepartments } from "../../services/departmentService";
import {
  getAppointments,
  deleteAppointment,
  getAppointmentById,
  createAppointment,
  updateAppointment,
} from "../../services/appointmentService";
import { AppointmentDto, CUAppointmentDto } from "../../types/appointmentTypes";
import { getAllPatients } from "../../services/patientService";
import { RoomDto } from "../../types/roomTypes";
import { PatientDto } from "../../types/patientTypes";

const EditDoctor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<CUDoctorDto>({
    firstName: "",
    lastName: "",
    gender: "",
    contactInfo: "",
    dateOfBirth: new Date(),
    dateHired: new Date(),
    specialty: "",
    qualifications: "",
    isAvailable: false,
    departmentId: 0,
    userId: "",
  });
  
  const [rooms, setRooms] = useState<RoomDto[]>([]); // For storing rooms related to the selected doctor
  const [patient, setPatients] = useState<PatientDto[]>([]);

  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentDto | null>(null);
  const [isCreatingAppointment, setIsCreatingAppointment] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<CUAppointmentDto>({
    appointmentDate: new Date(),
    patientId: 0,
    doctorId: 0,
    status: "Scheduled",
    roomId: 0,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsData = await getAllPatients(); // Assuming this fetches all patients
        setPatients(patientsData);
      } catch (err) {
        toast.error("Failed to fetch patients");
      }
    };

    const fetchDoctors = async () => {
      try {
        const doctorsData = await getDoctors(); // Assuming this fetches all doctors
        setDoctors(doctorsData);
      } catch (err) {
        toast.error("Failed to fetch doctors");
      }
    };

    const fetchDepartments = async () => {
      try {
        const departmentData = await getDepartments();
        setDepartments(departmentData);
      } catch (err) {
        toast.error("Failed to fetch departments");
      }
    };

    const fetchAppointments = async () => {
      try {
        const fetchedAppointments = await getAppointments();
        const transformedAppointments = fetchedAppointments.map(
          (item: any) => ({
            id: item.id,
            appointmentDate: new Date(item.appointmentDate),
            patientId: item.patientId,
            doctorId: item.doctorId,
            status: item.status,
            roomId: item.roomId,
          })
        );
        setAppointments(transformedAppointments);
      } catch (err) {
        toast.error("Failed to fetch appointments");
      }
    };

    const fetchDoctor = async () => {
      if (id) {
        try {
          const data: DoctorDto | null = await getDoctorById(Number(id));
          if (data) {
            setDoctor({
              firstName: data.firstName,
              lastName: data.lastName,
              gender: data.gender,
              contactInfo: data.contactInfo,
              dateOfBirth: new Date(data.dateOfBirth),
              dateHired: new Date(data.dateHired),
              specialty: data.specialty,
              qualifications: data.qualifications,
              isAvailable: data.isAvailable,
              departmentId: data.departmentId ?? 0,
              userId: data.userId,
            });
          } else {
            setError("Doctor not found");
          }
        } catch (err) {
          setError("Failed to fetch doctor details");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchPatients();
    fetchDoctors();
    fetchDepartments();
    fetchAppointments();
    fetchDoctor();
  }, [id]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;

    if (type === "checkbox") {
      setDoctor((prevState) => ({
        ...prevState,
        [name]: (event.target as HTMLInputElement).checked,
      }));
    } else if (type === "date") {
      setDoctor((prevState) => ({
        ...prevState,
        [name]: new Date(value),
      }));
    } else {
      setDoctor((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedDoctor: CUDoctorDto = {
      ...doctor,
      dateOfBirth: new Date(doctor.dateOfBirth),
      dateHired: new Date(doctor.dateHired),
    };

    try {
      if (id) {
        await updateDoctor(Number(id), updatedDoctor);
        toast.success("Doctor updated successfully");
      } else {
        toast.success("Doctor created successfully");
      }
      navigate("/dashboard/doctor-list");
    } catch (err) {
      toast.error("Failed to save doctor");
    }
  };

  const handleCreateAppointment = async () => {
    try {
      await createAppointment(formData);
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
    } catch (err) {
      toast.error("Failed to create appointment");
    }
  };

  const handleUpdateAppointment = async (id: number) => {
    try {
      await updateAppointment(id, formData);
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
    } catch (err) {
      toast.error("Failed to update appointment");
    }
  };

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

  const handleDoctorChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const doctorId = Number(e.target.value);
    setFormData((prev) => ({ ...prev, doctorId }));

    // Fetch the rooms for the selected doctor
    if (doctorId) {
      try {
        const doctorRooms = await getRoomsAssignedToDoctor(doctorId); // Assuming this fetches rooms for a doctor
        setRooms(doctorRooms);
      } catch (err) {
        toast.error("Failed to fetch rooms for the selected doctor");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "appointmentDate" ? new Date(value) : Number(value) || value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      appointmentDate: new Date(value),
    }));
  };

  const handleViewDetails = async (id: number) => {
    try {
      const appointment = await getAppointmentById(id);
      if (appointment) {
        const transformedAppointment: AppointmentDto = {
          ...appointment,
          appointmentDate: new Date(appointment.appointmentDate),
        };
        setSelectedAppointment(transformedAppointment);
      }
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to fetch appointment details.");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
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
              value={formData.appointmentDate.toISOString().split("T")[0]} // Format to YYYY-MM-DD
              onChange={handleDateChange}
              placeholder="Select date"
              title="Select the appointment date"
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
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName}
                </option>
              ))}
            </select>

            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="doctorId"
            >
              Doctor ID
            </label>
            <input
              type="number"
              id="doctorId"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleInputChange}
              placeholder="Enter Doctor ID"
              title="Enter Doctor ID"
              className="border rounded p-2 mb-4 w-full"
            />

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

            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="roomId"
            >
              Room ID
            </label>
            <input
              type="number"
              id="roomId"
              name="roomId"
              value={formData.roomId}
              onChange={handleInputChange}
              placeholder="Enter Room ID"
              title="Enter Room ID"
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
              <strong>Date:</strong>{" "}
              {selectedAppointment.appointmentDate.toDateString()}
            </p>
            <p>
              <strong>Patient ID:</strong> {selectedAppointment.patientId}
            </p>
            <p>
              <strong>Doctor ID:</strong> {selectedAppointment.doctorId}
            </p>
            <p>
              <strong>Status:</strong> {selectedAppointment.status}
            </p>
            <p>
              <strong>Room:</strong> {selectedAppointment.roomId}
            </p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
              onClick={() =>
                navigate(
                  `/dashboard/edit-appointment/${selectedAppointment.id}`
                )
              }
            >
              Edit Appointment
            </button>
            <button
              className="mt-4 ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-200"
              onClick={() => setSelectedAppointment(null)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditDoctor;
