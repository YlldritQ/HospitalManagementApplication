import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDepartments, deleteDepartment, addDoctorsToDepartment, removeDoctorsFromDepartment, addNursesToDepartment, removeNursesFromDepartment, addRoomsToDepartment, removeRoomsFromDepartment } from '../../services/departmentService';
import { DepartmentDto } from '../../types/departmentTypes';
import { toast, Toaster } from 'react-hot-toast';
import DepartmentModal from '../../components/modals/DepartmentModal'; // Adjust import as needed
import AssignModal from '../../components/modals/AssignModal'; // New import
import RemoveModal from '../../components/modals/RemoveModal'; // New import

const DepartmentList: React.FC = () => {
    const [departments, setDepartments] = useState<DepartmentDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
    const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState<boolean>(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState<boolean>(false);
    const [actionType, setActionType] = useState<'doctor' | 'nurse' | 'room' | null>(null); // Track the action type
    const [selectedItems, setSelectedItems] = useState<number[]>([]); // Store selected items for assignment/removal
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
        setIsDepartmentModalOpen(true);
    };

    const handleAssignClick = (id: number, type: 'doctor' | 'nurse' | 'room') => {
        setSelectedDepartment(id);
        setActionType(type);
        setIsAssignModalOpen(true);
    };

    const handleRemoveClick = (id: number, type: 'doctor' | 'nurse' | 'room') => {
        setSelectedDepartment(id);
        setActionType(type);
        setIsRemoveModalOpen(true);
    };

    const handleModalClose = () => {
        setIsDepartmentModalOpen(false);
        setIsAssignModalOpen(false);
        setIsRemoveModalOpen(false);
    };

    const handleAssignItems = async () => {
        if (selectedDepartment !== null && actionType && selectedItems.length > 0) {
            try {
                switch (actionType) {
                    case 'doctor':
                        await addDoctorsToDepartment(selectedDepartment, selectedItems);
                        break;
                    case 'nurse':
                        await addNursesToDepartment(selectedDepartment, selectedItems);
                        break;
                    case 'room':
                        await addRoomsToDepartment(selectedDepartment, selectedItems);
                        break;
                }
                toast.success('Items assigned successfully');
                handleModalClose();
            } catch (err) {
                toast.error('Failed to assign items');
            }
        }
    };

    const handleRemoveItems = async () => {
        if (selectedDepartment !== null && actionType && selectedItems.length > 0) {
            try {
                switch (actionType) {
                    case 'doctor':
                        await removeDoctorsFromDepartment(selectedDepartment, selectedItems);
                        break;
                    case 'nurse':
                        await removeNursesFromDepartment(selectedDepartment, selectedItems);
                        break;
                    case 'room':
                        await removeRoomsFromDepartment(selectedDepartment, selectedItems);
                        break;
                }
                toast.success('Items removed successfully');
                handleModalClose();
            } catch (err) {
                toast.error('Failed to remove items');
            }
        }
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
                                    onClick={() => handleRemoveClick(department.id, 'doctor')}
                                    className="text-red-500 hover:underline mr-3"
                                >
                                    Remove Doctors
                                </button>
                                <button
                                    onClick={() => handleRemoveClick(department.id, 'nurse')}
                                    className="text-red-500 hover:underline mr-3"
                                >
                                    Remove Nurses
                                </button>
                                <button
                                    onClick={() => handleRemoveClick(department.id, 'room')}
                                    className="text-red-500 hover:underline mr-3"
                                >
                                    Remove Rooms
                                </button>
                                <button
                                    onClick={() => handleAssignClick(department.id, 'doctor')}
                                    className="text-blue-500 hover:underline mr-3"
                                >
                                    Assign Doctors
                                </button>
                                <button
                                    onClick={() => handleAssignClick(department.id, 'nurse')}
                                    className="text-blue-500 hover:underline mr-3"
                                >
                                    Assign Nurses
                                </button>
                                <button
                                    onClick={() => handleAssignClick(department.id, 'room')}
                                    className="text-blue-500 hover:underline mr-3"
                                >
                                    Assign Rooms
                                </button>
                                <button
                                    onClick={() => handleDelete(department.id)}
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
            <DepartmentModal
                isOpen={isDepartmentModalOpen}
                onClose={handleModalClose}
                departmentId={selectedDepartment ?? 0}
            />
            <AssignModal
                isOpen={isAssignModalOpen}
                onClose={handleModalClose}
                onSubmit={handleAssignItems}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                actionType={actionType}
            />
            <RemoveModal
                isOpen={isRemoveModalOpen}
                onClose={handleModalClose}
                onSubmit={handleRemoveItems}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                actionType={actionType}
            />
        </div>
    );
};

export default DepartmentList;
