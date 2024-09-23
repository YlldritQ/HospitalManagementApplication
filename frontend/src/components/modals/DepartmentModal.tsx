import React, { useEffect, useState } from 'react';
import { createDepartment, updateDepartment, getDepartmentById } from '../../services/departmentService';
import { DepartmentDto } from '../../types/departmentTypes';
import { toast } from 'react-hot-toast';

interface DepartmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    departmentId: number;
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({ isOpen, onClose, departmentId }) => {
    const [department, setDepartment] = useState<DepartmentDto | null>(null);
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');

    useEffect(() => {
        if (departmentId > 0) {
            setMode('edit');
            const fetchDepartment = async () => {
                setLoading(true);
                try {
                    const data = await getDepartmentById(departmentId);
                    if (data) {
                        setDepartment(data);
                        setName(data.name);
                        setDescription(data.description);
                    }
                } catch (err) {
                    toast.error('Failed to fetch department');
                } finally {
                    setLoading(false);
                }
            };
            fetchDepartment();
        } else {
            setMode('create');
            setName('');
            setDescription('');
        }
    }, [departmentId, isOpen]);

    const handleSubmit = async () => {
        try {
            if (mode === 'create') {
                await createDepartment({ name, description });
                toast.success('Department created successfully');
            } else {
                if (department) {
                    await updateDepartment(departmentId, { ...department, name, description });
                    toast.success('Department updated successfully');
                }
            }
            onClose();
        } catch (err) {
            toast.error('Failed to save department');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="mt-10 w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              {mode === 'create' ? 'Add Department' : 'Edit Department'}
            </h2>
      
            {loading ? (
              <div className="text-center text-gray-300">Loading...</div>
            ) : (
              <div>
                <div className="mb-6">
                  <label htmlFor="department-name" className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    id="department-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter department name"
                    className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="department-description" className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    id="department-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter department description"
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
      
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={onClose}
                    className="py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className={`py-3 px-4 font-semibold rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      mode === 'create'
                        ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white'
                        : 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white'
                    }`}
                  >
                    {mode === 'create' ? 'Create' : 'Save'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
      
};

export default DepartmentModal;
