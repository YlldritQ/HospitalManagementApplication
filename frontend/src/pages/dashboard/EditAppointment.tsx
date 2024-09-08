import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAppointmentById, updateAppointment } from '../../services/appointmentService';
import { CUAppointmentDto, AppointmentDto } from '../../types/appointmentTypes';
import { toast } from 'react-toastify';
import { DepartmentDto } from '../../types/departmentTypes';
import { getDepartments } from '../../services/departmentService';


const EditAppointment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState<CUAppointmentDto>({
    patientId: 0,
    doctorId: 0,
    roomId: 0,
    appointmentDate: new Date(),
    status: '',
  });

  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departmentData: DepartmentDto[] = await getDepartments();
        setDepartments(departmentData);
      } catch (err) {
        toast.error('Failed to fetch departments');
      }
    };

    fetchDepartments();

    if (id) {
      const fetchAppointment = async () => {
        try {
          const data: AppointmentDto | null = await getAppointmentById(Number(id));
          if (data) {
            setAppointment({
              patientId: data.patientId,
              doctorId: data.doctorId,
              roomId: data.roomId,
              appointmentDate: new Date(data.appointmentDate),
              status: data.status || '',
            });
          } else {
            setError('Appointment not found');
          }
        } catch (err) {
          setError('Failed to fetch appointment details');
        } finally {
          setLoading(false);
        }
      };

      fetchAppointment();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;

    if (type === 'date' || type === 'datetime-local') {
      setAppointment((prevState) => ({
        ...prevState,
        [name]: new Date(value),
      }));
    } else {
      setAppointment((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submitted");
  
    try {
      if (id) {
        const response = await updateAppointment(Number(id), appointment);
        console.log(response);
        
        if (response.isSucceed) {
          toast.success(`Appointment updated successfully: ${response.message}`);
        } else {
          toast.error(`Failed to update appointment: ${response.message}`);
        }
      } else {
        // Handle the case for creating a new appointment if applicable
      }
      toast.success('Appointment created successfully');
      
      navigate('/dashboard/appointment');
        } catch (err) {
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow-md">
      <h1 className="text-2xl font-semibold mb-4">{id ? 'Edit Appointment' : 'Add New Appointment'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Patient ID */}
        <div>
          <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
            Patient ID
          </label>
          <input
            type="number"
            name="patientId"
            id="patientId"
            value={appointment.patientId}
            onChange={handleChange}
            placeholder="Enter patient ID"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Doctor ID */}
        <div>
          <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">
            Doctor ID
          </label>
          <input
            type="number"
            name="doctorId"
            id="doctorId"
            value={appointment.doctorId}
            onChange={handleChange}
            placeholder="Enter doctor ID"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Room ID */}
        <div>
          <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">
            Room ID
          </label>
          <input
            type="number"
            name="roomId"
            id="roomId"
            value={appointment.roomId}
            onChange={handleChange}
            placeholder="Enter room ID"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Appointment Date */}
        <div>
          <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700">
            Appointment Date
          </label>
          <input
            type="datetime-local"
            name="appointmentDate"
            id="appointmentDate"
            value={appointment.appointmentDate.toISOString().slice(0, 16)} // Ensure correct format for datetime-local
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <input
            type="text"
            name="status"
            id="status"
            value={appointment.status}
            onChange={handleChange}
            placeholder="Enter status"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAppointment;
