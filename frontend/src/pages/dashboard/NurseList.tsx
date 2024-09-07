import React, { useEffect, useState } from 'react';
import { getAllNurses, deleteNurse } from '../../services/nurseService'; // Adjust the import according to your project structure
import { NurseDto } from '../../types/nurseTypes';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications

const NurseList: React.FC = () => {
    const [nurses, setNurses] = useState<NurseDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); // Hook to navigate programmatically

    useEffect(() => {
        const fetchNurses = async () => {
            try {
                const data = await getAllNurses();
                setNurses(data);
            } catch (err) {
                setError('Failed to fetch nurses');
            } finally {
                setLoading(false);
            }
        };

        fetchNurses();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await deleteNurse(id);
            setNurses(nurses.filter(nurse => nurse.id !== id));
            toast.success('Nurse deleted successfully');
        } catch (err) {
            toast.error('Failed to delete nurse');
        }
    };

    const handleButtonClick = (id: number) => {
      console.log(`Navigating to /edit-nurse/${id}`);
      navigate(`/dashboard/edit-nurse/${id}`);
  };
  

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-600">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Nurse List</h1>
            <div className="mb-4">
                <button
                    onClick={() => navigate('/dashboard/edit-nurse/:id')}
                    className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Add New Nurse
                </button>
            </div>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="w-full bg-gray-200 text-left">
                        <th className="py-3 px-4 border-b">ID</th>
                        <th className="py-3 px-4 border-b">Name</th>
                        <th className="py-3 px-4 border-b">Contact Info</th>
                        <th className="py-3 px-4 border-b">Available</th>
                        <th className="py-3 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {nurses.map(nurse => (
                        <tr key={nurse.id} className="border-b">
                            <td className="py-3 px-4">{nurse.id}</td>
                            <td className="py-3 px-4">{`${nurse.firstName} ${nurse.lastName}`}</td>
                            <td className="py-3 px-4">{nurse.contactInfo}</td>
                            <td className="py-3 px-4">
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-white ${nurse.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}
                                >
                                    {nurse.isAvailable ? 'Available' : 'Not Available'}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <button
                                    onClick={() => handleButtonClick(nurse.id)}  // Correct ID passed here
                                    className="text-blue-500 hover:underline mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(nurse.id)}
                                    className="text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ToastContainer /> {/* Include ToastContainer in the component */}
        </div>
    );
};

export default NurseList;
