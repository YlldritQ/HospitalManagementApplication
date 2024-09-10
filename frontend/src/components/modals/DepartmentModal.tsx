import React, { useEffect, useState } from 'react';
import { createDepartment, updateDepartment, getDepartmentById } from '../../services/departmentService';
import { DepartmentDto, CreateDepartmentDto } from '../../types/departmentTypes';
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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">{mode === 'create' ? 'Add Department' : 'Edit Department'}</h2>

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div>
                        <div className="mb-4">
                            <label htmlFor="department-name" className="block text-gray-700">Name</label>
                            <input
                                id="department-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter department name"
                                className="border rounded w-full p-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="department-description" className="block text-gray-700">Description</label>
                            <textarea
                                id="department-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter department description"
                                className="border rounded w-full p-2"
                            />
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={onClose}
                                className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className={`py-2 px-4 rounded ${mode === 'create' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}
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
