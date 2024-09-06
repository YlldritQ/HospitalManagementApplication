import React, { useState, useEffect } from "react";
import { getDoctors } from "../../services/doctorService"; // Ensure correct import path

// Define the Doctor interface to match your backend DTO
interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  contactInfo: string;
  dateOfBirth: Date;
  dateHired: Date;
  specialty: string;
  qualifications: string;
  isAvailable: boolean;
  departmentId: number;
  userId: string;
}

// Function to transform backend data into the expected format
const transformDoctorData = (data: any): Doctor[] => {
  return data.map((item: any) => ({
    id: item.id,
    firstName: item.firstName,
    lastName: item.lastName,
    gender: item.gender,
    contactInfo: item.contactInfo,
    dateOfBirth: new Date(item.dateOfBirth),
    dateHired: new Date(item.dateHired),
    specialty: item.specialty,
    qualifications: item.qualifications,
    isAvailable: item.isAvailable,
    departmentId: item.departmentId,
    userId: item.userId,
  }));
};

const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const fetchedDoctors = await getDoctors();
        const transformedDoctors = transformDoctorData(fetchedDoctors);
        setDoctors(transformedDoctors);
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

    fetchDoctors();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Doctor List</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="p-6 border rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {doctor.firstName} {doctor.lastName}
            </h2>
            <p className="text-sm text-gray-600">ID: {doctor.id}</p>
            <p className="text-sm text-gray-600">
              Name: {doctor.firstName} {doctor.lastName}
            </p>
            <p className="text-sm text-gray-600">Department: </p>
            <p className="text-sm text-gray-600">
              Specialty: {doctor.specialty}
            </p>
            <p className="text-sm text-gray-600">
              Contact: {doctor.contactInfo}
            </p>
            <p className="text-sm text-gray-600">
              Available:{" "}
              <span
                className={
                  doctor.isAvailable ? "text-green-600" : "text-red-600"
                }
              >
                {doctor.isAvailable ? "Yes" : "No"}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
