import React, { useState, useEffect } from "react";
import { getAllPatients } from "../../services/patientService";

interface Patient {
  patientId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  contactInfo: string;
  userId: string;
}

const transformPatientData = (data: any): Patient[] => {
  // Inspect the data structure and adjust accordingly
  const patientArray = Array.isArray(data) ? data : data.patients || [];
  return patientArray.map((item: any) => ({
    patientId: item.patientId,
    firstName: item.firstName,
    lastName: item.lastName,
    dateOfBirth: new Date(item.dateOfBirth),
    gender: item.gender,
    contactInfo: item.contactInfo,
    userId: item.userId,
  }));
};

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const fetchedPatients = await getAllPatients();
        console.log(fetchedPatients); // Log to inspect
        const transformedPatients = transformPatientData(fetchedPatients);
        setPatients(transformedPatients);
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

    fetchPatients();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Patient List</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {patients.map((patient) => (
          <div
            key={patient.patientId}
            className="p-6 border rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {patient.firstName} {patient.lastName}
            </h2>
            <p className="text-sm text-gray-600">ID: {patient.patientId}</p>
            <p className="text-sm text-gray-600">Gender: {patient.gender}</p>
            <p className="text-sm text-gray-600">
              Contact Info: {patient.contactInfo}
            </p>
            <p className="text-sm text-gray-600">
              Date of Birth: {patient.dateOfBirth.toDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientList;
