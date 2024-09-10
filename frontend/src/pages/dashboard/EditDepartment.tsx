import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDepartmentById, updateDepartment } from '../../services/departmentService';
import { DepartmentDto } from '../../types/departmentTypes';
import { toast } from 'react-hot-toast';

const EditDepartment: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [department, setDepartment] = useState<DepartmentDto | null>(null);
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                const data = await getDepartmentById(Number(id));
                if (data) {
                    setDepartment(data);
                    setName(data.name);
                    setDescription(data.description);
                } else {
                    setError('Department not found');
                }
            } catch (err) {
                setError('Failed to fetch department');
                toast.error('Failed to fetch department');
            } finally {
                setLoading(false);
            }
        };

        fetchDepartment();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (department) {
                const updatedDepartment: DepartmentDto = { // Correct type here
                    id: department.id,
                    name,
                    description
                };
                await updateDepartment(department.id, updatedDepartment); // Update function needs id and full department object
                toast.success('Department updated successfully');
                navigate('/dashboard/department-list'); // Redirect to the department list
            }
        } catch (err) {
            toast.error('Failed to update department');
        }
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-600">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Department</h1>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter department name"
                        title="Department name"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter department description"
                        title="Department description"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        rows={4}
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/department-list')}
                        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditDepartment;
