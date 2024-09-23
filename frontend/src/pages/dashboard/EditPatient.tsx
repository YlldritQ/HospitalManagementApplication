import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPatientById, updatePatient } from "../../services/patientService";
import { CUPatientDto } from "../../types/patientTypes";
import toast from "react-hot-toast";

const EditPatient: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<CUPatientDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const fetchedPatient = await getPatientById(Number(id));
        if (fetchedPatient) {
          setPatient({
            firstName: fetchedPatient.firstName,
            lastName: fetchedPatient.lastName,
            dateOfBirth: new Date(fetchedPatient.dateOfBirth),
            gender: fetchedPatient.gender,
            contactInfo: fetchedPatient.contactInfo,
            userId: fetchedPatient.userId,
          });
        } else {
          setError("Patient not found");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (patient) {
      setPatient({
        ...patient,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (patient) {
      try {
        const response = await updatePatient(Number(id), patient);
        if (response.isSucceed) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
        navigate("/dashboard/patient-list");
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred.");
        }
      }
    }
  };

  const formatDate = (date: Date | string | null): string => {
    if (!date) return ""; // Return empty string if date is null or undefined

    const dateObj = typeof date === "string" ? new Date(date) : date;
    // Check if the date is valid
    return !isNaN(dateObj.getTime()) ? dateObj.toISOString().substring(0, 10) : "";
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  if (!patient) return <p>No patient data available.</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-5xl bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Edit Patient Information
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={patient.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
  
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={patient.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                value={patient.gender}
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
              <label
                htmlFor="contactInfo"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Contact Info
              </label>
              <input
                type="text"
                name="contactInfo"
                id="contactInfo"
                value={patient.contactInfo}
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
                value={formatDate(patient.dateOfBirth)} // Use formatted date
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                max={new Date().toISOString().substring(0, 10)} // Limit to past dates
                required
              />
            </div>
          </div>
  
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default EditPatient;
