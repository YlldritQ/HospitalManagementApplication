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
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-4">
          <div className="w-full max-w-xl bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
            <h1 className="text-3xl font-bold text-white mb-8 text-center">Edit Department</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter department name"
                  title="Department name"
                  required
                  className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter department description"
                  title="Department description"
                  rows={4}
                  required
                  className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="w-1/2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/department-list')}
                  className="w-1/2 py-3 px-4 ml-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      );
      
};

export default EditDepartment;
