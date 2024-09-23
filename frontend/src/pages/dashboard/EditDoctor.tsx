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
              departmentId: data.departmentId ?? 0,
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
        const response = await updateDoctor(Number(id), updatedDoctor);
        if (response.isSucceed) {
          toast.success(`Doctor updated successfully: ${response.message}`);
        } else {
          toast.error(`Failed to update Doctor: ${response.message}`);
        }
      }
      navigate('/dashboard/doctor-list');
    } catch (err) {
      toast.error('Failed to save doctor');
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
      <div className="w-full max-w-5xl bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Edit Doctor Information
        </h1>
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
                value={doctor.firstName}
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
                value={doctor.lastName}
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
                value={doctor.gender}
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
                value={doctor.contactInfo}
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
                value={formatDate(doctor.dateOfBirth)}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                max={new Date().toISOString().substring(0, 10)}
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
                value={doctor.dateHired.toISOString().substring(0, 10)}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
  
          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-gray-300 mb-1">
              Specialty
            </label>
            <input
              type="text"
              name="specialty"
              id="specialty"
              value={doctor.specialty}
              onChange={handleChange}
              placeholder="Enter specialty"
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
  
          <div>
            <label htmlFor="qualifications" className="block text-sm font-medium text-gray-300 mb-1">
              Qualifications
            </label>
            <input
              type="text"
              name="qualifications"
              id="qualifications"
              value={doctor.qualifications}
              onChange={handleChange}
              placeholder="Enter qualifications"
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="departmentId" className="block text-sm font-medium text-gray-300 mb-1">
                Department
              </label>
              <select
                name="departmentId"
                id="departmentId"
                value={doctor.departmentId}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
  
            <div>
              <label htmlFor="isAvailable" className="block text-sm font-medium text-gray-300 mb-1">
                Availability
              </label>
              <input
                type="checkbox"
                name="isAvailable"
                id="isAvailable"
                checked={doctor.isAvailable}
                onChange={handleChange}
                className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
              />
            </div>
          </div>
  
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default EditDoctor;
