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
        <div className="flex flex-col items-center justify-start min-h-screen w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-4">
          <h1 className="text-3xl font-bold text-white mb-8">Department List</h1>
          <div className="w-full max-w-6xl mb-6">
            <button
              onClick={handleAddDepartmentClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add New Department
            </button>
          </div>
          <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">ID</th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Name</th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Description</th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department) => (
                <tr key={department.id} className="hover:bg-gray-600 transition duration-200 border-b border-gray-600">
                  <td className="py-4 px-6 text-sm text-gray-300">{department.id}</td>
                  <td className="py-4 px-6 text-sm text-gray-300">{department.name}</td>
                  <td className="py-4 px-6 text-sm text-gray-300">{department.description}</td>
                  <td className="py-4 px-6 text-sm flex space-x-4">
                    <button
                      onClick={() => handleButtonClick(department.id)}
                      className="text-blue-400 hover:text-blue-500 transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(department.id)}
                      className="text-red-400 hover:text-red-500 transition duration-200"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleManageClick(department.id)}
                      className="text-green-400 hover:text-green-500 transition duration-200"
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
