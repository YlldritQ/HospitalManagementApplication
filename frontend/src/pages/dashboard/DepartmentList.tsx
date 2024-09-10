import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { DepartmentDto } from '../../types/departmentTypes';
import DepartmentModal from '../../components/modals/DepartmentModal';
import ManageDepartmentModal from '../../components/modals/ManageDepartmentModal'; // Add import for ManageDepartmentModal
import { getDepartments, deleteDepartment } from '../../services/departmentService';

const DepartmentList: React.FC = () => {
    const [departments, setDepartments] = useState<DepartmentDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isManageModalOpen, setIsManageModalOpen] = useState<boolean>(false); // Add state for ManageDepartmentModal
    const [actionType, setActionType] = useState<'assign' | 'remove' | null>(null); // Add state for action type
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const data = await getDepartments();
                setDepartments(data);
            } catch (err) {
                setError('Failed to fetch departments');
                toast.error('Failed to fetch departments');
            } finally {
                setLoading(false);
            }
        };

        fetchDepartments();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await deleteDepartment(id);
            setDepartments(departments.filter(department => department.id !== id));
            toast.success('Department deleted successfully');
        } catch (err) {
            toast.error('Failed to delete department');
        }
    };

    const handleButtonClick = (id: number) => {
        navigate(`/dashboard/edit-department/${id}`);
    };

    const handleAddDepartmentClick = () => {
        setSelectedDepartment(null);
        setIsModalOpen(true);
    };

    const handleManageClick = (id: number) => {
        console.log("true");
        setSelectedDepartment(id);
        setIsManageModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setIsManageModalOpen(false); // Close the manage modal
        setActionType(null); // Reset action type
    };

    const handleActionSelect = (action: 'assign' | 'remove') => {
        setActionType(action);
        // Logic to open appropriate sub-modal can be added here if needed
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-600">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Department List</h1>
            <div className="mb-4">
                <button
                    onClick={handleAddDepartmentClick}
                    className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Add New Department
                </button>
            </div>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="w-full bg-gray-200 text-left">
                        <th className="py-3 px-4 border-b">ID</th>
                        <th className="py-3 px-4 border-b">Name</th>
                        <th className="py-3 px-4 border-b">Description</th>
                        <th className="py-3 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {departments.map(department => (
                        <tr key={department.id} className="border-b">
                            <td className="py-3 px-4">{department.id}</td>
                            <td className="py-3 px-4">{department.name}</td>
                            <td className="py-3 px-4">{department.description}</td>
                            <td className="py-3 px-4">
                                <button
                                    onClick={() => handleButtonClick(department.id)}
                                    className="text-blue-500 hover:underline mr-3"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(department.id)}
                                    className="text-red-500 hover:underline mr-3"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => handleManageClick(department.id)}
                                    className="text-green-500 hover:underline"
                                >
                                    Manage
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Toaster />
            <DepartmentModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                departmentId={selectedDepartment ?? 0}
            />
            <ManageDepartmentModal
                isOpen={isManageModalOpen}
                onClose={handleModalClose}
                departmentId={selectedDepartment ?? 0}
                onActionSelect={handleActionSelect}
                actionType={actionType}
            />
        </div>
    );
};

export default DepartmentList;
