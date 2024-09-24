import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoctors, deleteDoctor, assignRoomsToDoctor, removeRoomsFromDoctor } from '../../services/doctorService';
import { DoctorDto, DoctorRoomManagementDto } from '../../types/doctorTypes';
import { toast, Toaster } from 'react-hot-toast';
import { getDepartmentById } from '../../services/departmentService';
import RoomAssignmentModal from '../../components/modals/RoomAssignmentModal'; // Adjust the import path as needed

const DoctorList: React.FC = () => {
    const [doctors, setDoctors] = useState<DoctorDto[]>([]);
    const [departments, setDepartments] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await getDoctors();
                setDoctors(data);
                const departmentIds = Array.from(new Set(data.map(doctor => doctor.departmentId).filter(id => id > 0)));
                const departmentPromises = departmentIds.map(id => getDepartmentById(id));
                const departmentData = await Promise.all(departmentPromises);
                const departmentMap: Record<number, string> = {};
                departmentData.forEach(department => {
                    if (department) {
                        departmentMap[department.id] = department.name;
                    }
                });
                setDepartments(departmentMap);
            } catch (err) {
                setError('Failed to fetch doctors');
                toast.error('Failed to fetch doctors');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await deleteDoctor(id);
            setDoctors(doctors.filter(doctor => doctor.id !== id));
            toast.success('Doctor deleted successfully');
        } catch (err) {
            toast.error('Failed to delete doctor');
        }
    };

    const handleButtonClick = (id: number) => {
        navigate(`/dashboard/edit-doctor/${id}`);
    };

    const handleAssignRooms = async (dto: DoctorRoomManagementDto) => {
        try {
            await assignRoomsToDoctor(dto.doctorId, dto);
            toast.success('Rooms assigned successfully');
            setIsModalOpen(false);
            // Optionally, refresh doctor data or update the UI
        } catch (err) {
            toast.error('Failed to assign rooms');
        }
    };

    const handleRemoveRooms = async (dto: DoctorRoomManagementDto) => {
        try {
            await removeRoomsFromDoctor(dto.doctorId, dto);
            toast.success('Rooms removed successfully');
            setIsModalOpen(false);
            // Optionally, refresh doctor data or update the UI
        } catch (err) {
            toast.error('Failed to remove rooms');
        }
    };

    const handleAssignRoomsClick = (doctorId: number, departmentId: number) => {
        setSelectedDoctor(doctorId);
        setSelectedDepartment(departmentId);
        setIsModalOpen(true);
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-600">{error}</div>;

    return (
        <div className="flex flex-col items-start justify-start p-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 min-h-screen w-full">
          <h1 className="text-3xl font-bold text-white mb-8">Doctor List</h1>
          
          <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">ID</th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Name</th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Specialty</th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Contact Info</th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Department</th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Available</th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map(doctor => (
                <tr key={doctor.id} className="border-b border-gray-700">
                  <td className="py-4 px-6 text-white">{doctor.id}</td>
                  <td className="py-4 px-6 text-white">{`${doctor.firstName} ${doctor.lastName}`}</td>
                  <td className="py-4 px-6 text-white">{doctor.specialty}</td>
                  <td className="py-4 px-6 text-white">{doctor.contactInfo}</td>
                  <td className="py-4 px-6 text-white">
                    {doctor.departmentId > 0 ? departments[doctor.departmentId] : 'N/A'}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-white font-semibold ${
                        doctor.isAvailable ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {doctor.isAvailable ? 'Available' : 'Not Available'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleButtonClick(doctor.id)}
                      className="text-blue-400 hover:underline mr-4 transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(doctor.id)}
                      className="text-red-400 hover:underline mr-4 transition duration-200"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleAssignRoomsClick(doctor.id, doctor.departmentId)}
                      className="text-green-400 hover:underline transition duration-200"
                    >
                      Manage Rooms
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <Toaster />
          {selectedDoctor !== null && selectedDepartment !== null && (
            <RoomAssignmentModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              doctorId={selectedDoctor ?? 0}
              departmentId={selectedDepartment ?? 0}
              onAssign={handleAssignRooms}
              onRemove={handleRemoveRooms}
            />
          )}
        </div>
      );
      
};

export default DoctorList;