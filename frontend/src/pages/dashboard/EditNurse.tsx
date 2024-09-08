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
  
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);  // State to store departments
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departmentData: DepartmentDto[] = await getDepartments();  // Fetch departments from the backend
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
      // Convert the date input to a Date object
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
        await updateNurse(Number(id), updatedNurse);
        toast.success('Nurse updated successfully');
      } else {
        toast.success('Nurse created successfully');
      }
      navigate('/dashboard/nurse-list');
    } catch (err) {
      toast.error('Failed to save nurse');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow-md">
      <h1 className="text-2xl font-semibold mb-4">{id ? 'Edit Nurse' : 'Add New Nurse'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={nurse.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={nurse.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            name="gender"
            id="gender"
            value={nurse.gender}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Contact Info */}
        <div>
          <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">
            Contact Info
          </label>
          <input
            type="text"
            name="contactInfo"
            id="contactInfo"
            value={nurse.contactInfo}
            onChange={handleChange}
            placeholder="Enter contact info"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            id="dateOfBirth"
            value={nurse.dateOfBirth.toISOString().substring(0, 10)}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Date Hired */}
        <div>
          <label htmlFor="dateHired" className="block text-sm font-medium text-gray-700">
            Date Hired
          </label>
          <input
            type="date"
            name="dateHired"
            id="dateHired"
            value={nurse.dateHired.toISOString().substring(0, 10)}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Qualifications */}
        <div>
          <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700">
            Qualifications
          </label>
          <input
            type="text"
            name="qualifications"
            id="qualifications"
            value={nurse.qualifications}
            onChange={handleChange}
            placeholder="Enter qualifications"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Is Available */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isAvailable"
            id="isAvailable"
            checked={nurse.isAvailable}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-700">
            Available
          </label>
        </div>

        {/* Department Dropdown */}
        <div>
          <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            name="departmentId"
            id="departmentId"
            value={nurse.departmentId}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {id ? 'Update Nurse' : 'Add Nurse'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNurse;
