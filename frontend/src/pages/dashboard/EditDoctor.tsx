import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoctorById, updateDoctor } from '../../services/doctorService';
import { CUDoctorDto, DoctorDto } from '../../types/doctorTypes';
import { toast } from 'react-hot-toast';
import { DepartmentDto } from '../../types/departmentTypes';
import { getDepartments } from '../../services/departmentService';

const EditDoctor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<CUDoctorDto>({
    firstName: '',
    lastName: '',
    gender: '',
    contactInfo: '',
    dateOfBirth: new Date(),
    dateHired: new Date(),
    specialty: '',
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
      const fetchDoctor = async () => {
        try {
          const data: DoctorDto | null = await getDoctorById(Number(id));
          if (data) {
            setDoctor({
              firstName: data.firstName,
              lastName: data.lastName,
              gender: data.gender,
              contactInfo: data.contactInfo,
              dateOfBirth: new Date(data.dateOfBirth),
              dateHired: new Date(data.dateHired),
              specialty: data.specialty,
              qualifications: data.qualifications,
              isAvailable: data.isAvailable,
              departmentId: data.departmentId ?? 0, // Use nullish coalescing to handle potential null values
              userId: data.userId,
            });
          } else {
            setError('Doctor not found');
          }
        } catch (err) {
          setError('Failed to fetch doctor details');
        } finally {
          setLoading(false);
        }
      };

      fetchDoctor();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;

    if (type === 'checkbox') {
      setDoctor((prevState) => ({
        ...prevState,
        [name]: (event.target as HTMLInputElement).checked,
      }));
    } else if (type === 'date') {
      setDoctor((prevState) => ({
        ...prevState,
        [name]: new Date(value),
      }));
    } else {
      setDoctor((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedDoctor: CUDoctorDto = {
      ...doctor,
      dateOfBirth: new Date(doctor.dateOfBirth),
      dateHired: new Date(doctor.dateHired),
    };

    try {
      if (id) {
        console.log(updatedDoctor);
        const response = await updateDoctor(Number(id), updatedDoctor);
        console.log(response);
        if(response.isSucceed)
        {
          toast.success(`Doctor updated successfully: ${response.message}`);
        }else
        {
          toast.error(`Failed to update Doctor: ${response.message}`);
        }
      }
      navigate('/dashboard/doctor-list');
    } catch (err) {
      toast.error('Failed to save doctor');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow-md">
      <h1 className="text-2xl font-semibold mb-4">{id ? 'Edit Doctor' : 'Add New Doctor'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
      <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={doctor.firstName}
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
            value={doctor.lastName}
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
            value={doctor.gender}
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
            value={doctor.contactInfo}
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
            value={doctor.dateOfBirth.toISOString().substring(0, 10)}
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
            value={doctor.dateHired.toISOString().substring(0, 10)}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Specialty */}
        <div>
          <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
            Specialty
          </label>
          <input
            type="text"
            name="specialty"
            id="specialty"
            value={doctor.specialty}
            onChange={handleChange}
            placeholder="Enter specialty"
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
            value={doctor.qualifications}
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
            checked={doctor.isAvailable}
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
            value={doctor.departmentId}
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
        <div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDoctor;
