import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNurseById, updateNurse } from '../../services/nurseService';
import { CUNurseDto, NurseDto } from '../../types/nurseTypes';
import { toast } from 'react-toastify';
import { DepartmentDto } from '../../types/departmentTypes';
import { getDepartments } from '../../services/departmentService';

const EditNurse: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [nurse, setNurse] = useState<CUNurseDto>({
    firstName: '',
    lastName: '',
    gender: '',
    contactInfo: '',
    dateOfBirth: new Date(),
    dateHired: new Date(),
    qualifications: '',
    isAvailable: false,
    departmentId: 0,
    userId: '',
  });

  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departmentData: DepartmentDto[] = await getDepartments();
        setDepartments(departmentData);
      } catch (err) {
        toast.error('Failed to fetch departments');
      }
    };

    fetchDepartments();

    if (id) {
      const fetchNurse = async () => {
        try {
          const data: NurseDto = await getNurseById(Number(id));
          setNurse({
            firstName: data.firstName,
            lastName: data.lastName,
            gender: data.gender,
            contactInfo: data.contactInfo,
            dateOfBirth: new Date(data.dateOfBirth),
            dateHired: new Date(data.dateHired),
            qualifications: data.qualifications,
            isAvailable: data.isAvailable,
            departmentId: data.departmentId,
            userId: data.userId,
          });
        } catch (err) {
          setError('Failed to fetch nurse details');
        } finally {
          setLoading(false);
        }
      };

      fetchNurse();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;

    if (type === 'checkbox') {
      setNurse((prevState) => ({
        ...prevState,
        [name]: (event.target as HTMLInputElement).checked,
      }));
    } else if (type === 'date') {
      setNurse((prevState) => ({
        ...prevState,
        [name]: new Date(value),
      }));
    } else {
      setNurse((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedNurse: CUNurseDto = {
      ...nurse,
      dateOfBirth: new Date(nurse.dateOfBirth),
      dateHired: new Date(nurse.dateHired),
    };

    try {
      if (id) {
        const response = await updateNurse(Number(id), updatedNurse);
        if(response.isSucceed) {
          toast.success(`Nurse updated successfully: ${response.message}`);
        } else {
          toast.error(`Failed to update Nurse: ${response.message}`);
        }
      }
      navigate('/dashboard/nurse-list');
    } catch (err) {
      toast.error('Failed to save nurse');
    }
  };

  const formatDate = (date: Date | string | null): string => {
    if (!date) return ""; // Return empty string if date is null or undefined

    const dateObj = typeof date === "string" ? new Date(date) : date;
    // Check if the date is valid
    return !isNaN(dateObj.getTime()) ? dateObj.toISOString().substring(0, 10) : "";
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-xl bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Edit Nurse Information</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={nurse.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
  
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={nurse.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-1">
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                value={nurse.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
  
            <div>
              <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-300 mb-1">
                Contact Info
              </label>
              <input
                type="text"
                name="contactInfo"
                id="contactInfo"
                value={nurse.contactInfo}
                onChange={handleChange}
                placeholder="Enter contact info"
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                value={formatDate(nurse.dateOfBirth)}
                onChange={handleChange}
                max={new Date().toISOString().substring(0, 10)} // Limit to past dates
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
  
            <div>
              <label htmlFor="dateHired" className="block text-sm font-medium text-gray-300 mb-1">
                Date Hired
              </label>
              <input
                type="date"
                name="dateHired"
                id="dateHired"
                value={formatDate(nurse.dateHired)}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
  
          <div>
            <label htmlFor="qualifications" className="block text-sm font-medium text-gray-300 mb-1">
              Qualifications
            </label>
            <input
              type="text"
              name="qualifications"
              id="qualifications"
              value={nurse.qualifications}
              onChange={handleChange}
              placeholder="Enter qualifications"
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
  
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isAvailable"
              id="isAvailable"
              checked={nurse.isAvailable}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-300">
              Available
            </label>
          </div>
  
          <div>
            <label htmlFor="departmentId" className="block text-sm font-medium text-gray-300 mb-1">
              Department
            </label>
            <select
              name="departmentId"
              id="departmentId"
              value={nurse.departmentId}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
  
          <div className="flex justify-end">
            <button
              type="submit"
              className="mt-4 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {id ? 'Update Nurse' : 'Add Nurse'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default EditNurse;
