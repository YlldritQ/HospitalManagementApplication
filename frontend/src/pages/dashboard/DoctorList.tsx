import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoctors, deleteDoctor } from '../../services/doctorService';
import { DoctorDto } from '../../types/doctorTypes';
import { toast, Toaster } from 'react-hot-toast';
//import 'react-toastify/dist/ReactToastify.css';
import { getDepartmentById } from '../../services/departmentService'; // Import the function to get department by ID

const DoctorList: React.FC = () => {
    const [doctors, setDoctors] = useState<DoctorDto[]>([]);
    const [departments, setDepartments] = useState<Record<number, string>>({}); // Mapping from departmentId to department name
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
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

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-600">{error}</div>;

    return (
        <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Doctor List</h1>
            <div className="mb-4">
                <button
                    onClick={() => navigate('/dashboard/edit-doctor/new')}
                    className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Add New Doctor
                </button>
            </div>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="w-full bg-gray-200 text-left">
                        <th className="py-3 px-4 border-b">ID</th>
                        <th className="py-3 px-4 border-b">Name</th>
                        <th className="py-3 px-4 border-b">Specialty</th>
                        <th className="py-3 px-4 border-b">Contact Info</th>
                        <th className="py-3 px-4 border-b">Department</th>
                        <th className="py-3 px-4 border-b">Available</th>
                        <th className="py-3 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {doctors.map(doctor => (
                        <tr key={doctor.id} className="border-b">
                            <td className="py-3 px-4">{doctor.id}</td>
                            <td className="py-3 px-4">{`${doctor.firstName} ${doctor.lastName}`}</td>
                            <td className="py-3 px-4">{doctor.specialty}</td>
                            <td className="py-3 px-4">{doctor.contactInfo}</td>
                            <td className="py-3 px-4">
                                {doctor.departmentId > 0 ? departments[doctor.departmentId] : 'N/A'}
                            </td>
                            <td className="py-3 px-4">
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-white ${doctor.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}
                                >
                                    {doctor.isAvailable ? 'Available' : 'Not Available'}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <button
                                    onClick={() => handleButtonClick(doctor.id)}
                                    className="text-blue-500 hover:underline mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(doctor.id)}
                                    className="text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Toaster />
        </div>
    );
};

export default DoctorList;
