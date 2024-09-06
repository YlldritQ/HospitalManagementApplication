import React, { useState, useEffect } from "react";
import { getNurses } from "../../services/nurseService"; // Ensure correct import path

// Define the Nurse interface to match your backend DTO
interface Nurse {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  contactInfo: string;
  dateOfBirth: Date;
  dateHired: Date;
  qualifications: string;
  isAvailable: boolean;
  departmentId: number;
  userId: string;
}

// Function to transform backend data into the expected format
const transformNurseData = (data: any): Nurse[] => {
  return data.map((item: any) => ({
    id: item.id,
    firstName: item.firstName,
    lastName: item.lastName,
    gender: item.gender,
    contactInfo: item.contactInfo,
    dateOfBirth: new Date(item.dateOfBirth),
    dateHired: new Date(item.dateHired),
    qualifications: item.qualifications,
    isAvailable: item.isAvailable,
    departmentId: item.departmentId,
    userId: item.userId,
  }));
};

const NurseList: React.FC = () => {
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNurses = async () => {
      try {
        const fetchedNurses = await getNurses();
        const transformedNurses = transformNurseData(fetchedNurses);
        setNurses(transformedNurses);
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

    fetchNurses();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Nurse List</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {nurses.map((nurse) => (
          <div
            key={nurse.id}
            className="p-6 border rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {nurse.firstName} {nurse.lastName}
            </h2>
            <p className="text-sm text-gray-600">ID: {nurse.id}</p>
            <p className="text-sm text-gray-600">
              Name: {nurse.firstName} {nurse.lastName}
            </p>
            <p className="text-sm text-gray-600">Department ID: {nurse.departmentId}</p>
            <p className="text-sm text-gray-600">
              Contact: {nurse.contactInfo}
            </p>
            <p className="text-sm text-gray-600">
              Available:{" "}
              <span
                className={
                  nurse.isAvailable ? "text-green-600" : "text-red-600"
                }
              >
                {nurse.isAvailable ? "Yes" : "No"}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Qualifications: {nurse.qualifications}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NurseList;
