import React, { useState, useEffect } from "react";
import { CUAppointmentDto, AppointmentDto } from "../../types/appointmentTypes";
import {
  getDoctors,
  getRoomsAssignedToDoctor,
} from "../../services/doctorService";
import { DoctorDto } from "../../types/doctorTypes";
import { RoomDto } from "../../types/roomTypes";
import { PatientDto } from "../../types/patientTypes";
import { getPatientById } from "../../services/patientService";
import useAuth from "../../hooks/useAuth.hook";

interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (appointment: CUAppointmentDto) => void;
  appointment: AppointmentDto; // Existing appointment details
}

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  appointment,
}) => {
    const formatDate = (date: Date | string | null): string => {
        if (!date) return "";
        const dateObj = typeof date === "string" ? new Date(date) : date;
        if (!isNaN(dateObj.getTime())) {
          const timezoneOffset = dateObj.getTimezoneOffset() * 60000; // Offset in milliseconds
          const localDate = new Date(dateObj.getTime() - timezoneOffset);
          return localDate.toISOString().substring(0, 16); // YYYY-MM-DDTHH:mm format
        }
        return "";
      };
      
      
  const { user: loggedInUser } = useAuth(); // Get the logged-in user
  const roles = loggedInUser?.roles;

  // Form state
  const [appointmentDate, setAppointmentDate] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [status, setStatus] = useState("");
  const [roomId, setRoomId] = useState("");
  const [patient, setPatient] = useState<PatientDto | undefined>();

  const [doctors, setDoctors] = useState<DoctorDto[]>([]);
  const [rooms, setRooms] = useState<RoomDto[]>([]);

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset form with current appointment data
      setAppointmentDate(formatDate(appointment.appointmentDate));
      setDoctorId(appointment.doctorId.toString());
      setStatus(appointment.status);
      setRoomId(appointment.roomId.toString());

      // Fetch doctors and rooms
      getDoctors().then(setDoctors).catch(console.error);
      getPatientById(appointment.patientId)
        .then((patientData) => setPatient(patientData ?? undefined))
        .catch(console.error);

      if (appointment.doctorId) {
        getRoomsAssignedToDoctor(appointment.doctorId)
          .then(setRooms)
          .catch(console.error);
      }
    }
  }, [isOpen, appointment]);

  useEffect(() => {
    if (doctorId) {
      getRoomsAssignedToDoctor(Number(doctorId))
        .then(setRooms)
        .catch(console.error);
    }
  }, [doctorId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    // Convert the local time back to UTC
    const localDate = new Date(appointmentDate);
    const timezoneOffset = localDate.getTimezoneOffset() * 60000; // Offset in milliseconds
    const utcDate = new Date(localDate.getTime() - timezoneOffset); // Convert local time to UTC
  
    const updatedAppointment: CUAppointmentDto = {
      appointmentDate: utcDate, // Send the UTC date to the server
      patientId: appointment.patientId, // Keep patientId unchanged
      doctorId: Number(doctorId),
      status,
      roomId: Number(roomId),
    };
    onSubmit(updatedAppointment);
  };
  

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 backdrop-blur-sm bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Edit Appointment</h2>
        <form onSubmit={handleSubmit}>
          {/* Appointment Date */}
          <div className="mb-4">
            <label
              className="block text-white text-sm font-medium mb-2"
              htmlFor="appointmentDate"
            >
              Appointment Date
            </label>
            <input
              type="datetime-local"
              id="appointmentDate"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
            />
          </div>

          {/* Patient (read-only) */}
          <div className="mb-4">
            <label
              className="block text-white text-sm font-medium mb-2"
              htmlFor="patientId"
            >
              Patient
            </label>
            <input
              type="text"
              id="patientId"
              className="w-full px-3 py-2 bg-gray-600 text-white rounded-md"
              value={
                patient
                  ? `${patient.firstName} ${patient.lastName}`
                  : "Loading..."
              }
              disabled
            />
          </div>

          {/* Doctor */}
          <div className="mb-4">
            <label
              className="block text-white text-sm font-medium mb-2"
              htmlFor="doctorId"
            >
              Doctor
            </label>
            <select
              id="doctorId"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              required
            >
              <option value="">Select a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.firstName} {doctor.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Room */}
          <div className="mb-4">
            <label
              className="block text-white text-sm font-medium mb-2"
              htmlFor="roomId"
            >
              Room
            </label>
            <select
              id="roomId"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              required
            >
              <option value="">Select a room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  Room {room.id}
                </option>
              ))}
            </select>
          </div>

          {/* Status (conditionally rendered) */}
          {roles && !roles.includes("Patient") && (
            <div className="mb-4">
              <label
                className="block text-white text-sm font-medium mb-2"
                htmlFor="status"
              >
                Status
              </label>
              <select
                id="status"
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              type="button"
              className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 rounded bg-yellow-600 text-white"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default EditAppointmentModal;
