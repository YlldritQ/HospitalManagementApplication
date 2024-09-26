import React, { useState, useEffect } from "react";
import { CUAppointmentDto } from "../../types/appointmentTypes";
import {
  getDoctors,
  getRoomsAssignedToDoctor,
} from "../../services/doctorService";
import {
  getAllPatients,
  getPatientByUserId,
} from "../../services/patientService";
import { DoctorDto } from "../../types/doctorTypes";
import { PatientDto } from "../../types/patientTypes";
import { RoomDto } from "../../types/roomTypes";
import useAuth from "../../hooks/useAuth.hook";

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (appointment: CUAppointmentDto) => void;
}

const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [appointmentDate, setAppointmentDate] = useState("");
  const [patientId, setPatientId] = useState("");
  const { user: loggedInUser } = useAuth(); // Get the logged-in user
  const userId = loggedInUser?.id;
  const roles = loggedInUser?.roles;
  const [doctorId, setDoctorId] = useState("");
  const [roomId, setRoomId] = useState("");

  const [patients, setPatients] = useState<PatientDto[]>([]);
  const [doctors, setDoctors] = useState<DoctorDto[]>([]);
  const [rooms, setRooms] = useState<RoomDto[]>([]);

  useEffect(() => {
    if (isOpen) {
      getDoctors().then(setDoctors).catch(console.error);
      getAllPatients().then(setPatients).catch(console.error);

      // If the user is a patient, automatically set their patientId
      if (roles?.includes("Patient")) {
        getPatientByUserId(userId).then((patientData) =>
          setPatientId(String(patientData?.patientId))
        );
      }
    }
  }, [isOpen, roles, userId]);

  useEffect(() => {
    if (doctorId) {
      getRoomsAssignedToDoctor(Number(doctorId))
        .then(setRooms)
        .catch(console.error);
    }
  }, [doctorId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment: CUAppointmentDto = {
      appointmentDate: new Date(appointmentDate),
      patientId: Number(patientId),
      doctorId: Number(doctorId),
      status: "Scheduled", // Default status for new appointments
      roomId: Number(roomId),
    };
    onSubmit(newAppointment);
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 backdrop-blur-sm bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Create Appointment
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Appointment Date */}
          <div className="mb-4">
            <label htmlFor="appointmentDate" className="block text-white mb-2">
              Appointment Date
            </label>
            <input
              type="datetime-local"
              id="appointmentDate"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          {/* Patient Selection */}
          {roles?.includes("Admin") ? (
            <div className="mb-4">
              <label htmlFor="patient" className="block text-white mb-2">
                Select Patient
              </label>
              <select
                id="patient"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
                className="w-full p-2 rounded bg-gray-700 text-white"
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient.patientId} value={patient.patientId}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="mb-4">
              <label htmlFor="patient" className="block text-white mb-2">
                Patient
              </label>
              <input
                type="text"
                id="patient"
                value={`${loggedInUser?.firstName} ${loggedInUser?.lastName}`}
                disabled
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>
          )}

          {/* Doctor Selection */}
          <div className="mb-4">
            <label htmlFor="doctor" className="block text-white mb-2">
              Select Doctor
            </label>
            <select
              id="doctor"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              <option value="">Select a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.firstName} {doctor.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Room Selection */}
          {rooms.length > 0 && (
            <div className="mb-4">
              <label htmlFor="room" className="block text-white mb-2">
                Select Room
              </label>
              <select
                id="room"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                required
                className="w-full p-2 rounded bg-gray-700 text-white"
              >
                <option value="">Select a room</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    Room {room.roomNumber} (
                    {room.isOccupied ? "Occupied" : "Available"})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Submit and Cancel Buttons */}
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
              className="py-2 px-4 rounded bg-blue-600 text-white"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default CreateAppointmentModal;
