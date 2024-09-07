import React, { useState, useEffect } from "react";
import { getAppointments, deleteAppointment } from "../../services/appointmentService";

interface Appointment {
  id: number;
  appointmentDate: Date;
  patientId: number;
  doctorId: number;
  status: string;
  roomId: number;
}

const transformAppointmentData = (data: any): Appointment[] => {
  return data.map((item: any) => ({
    id: item.id,
    appointmentDate: new Date(item.appointmentDate),
    patientId: item.patientId,
    doctorId: item.doctorId,
    status: item.status,
    roomId: item.roomId,
  }));
};

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const fetchedAppointments = await getAppointments();
        const transformedAppointments = transformAppointmentData(fetchedAppointments);
        setAppointments(transformedAppointments);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteAppointment(id);
      setAppointments(appointments.filter(appointment => appointment.id !== id));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to delete appointment.");
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Appointment List</h1>

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
            <p className="text-sm text-gray-600">Patient ID: {appointment.patientId}</p>
            <p className="text-sm text-gray-600">Doctor ID: {appointment.doctorId}</p>
            <p className="text-sm text-gray-600">Room: {appointment.roomId}</p>
            <p className="text-sm text-gray-600">Status: {appointment.status}</p>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
              onClick={() => handleDelete(appointment.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentList;
