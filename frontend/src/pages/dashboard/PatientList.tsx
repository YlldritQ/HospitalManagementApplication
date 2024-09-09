import React, { useState, useEffect } from "react";
import { getAllPatients, deletePatient } from "../../services/patientService";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const fetchedPatients = await getAllPatients();
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

  const handleDelete = async (patientId: number) => {
    try {
      await deletePatient(patientId);
      setPatients(patients.filter(patient => patient.patientId !== patientId));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleEdit = (patientId: number) => {
    navigate(`/dashboard/edit-patient/${patientId}`);
  };

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
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={() => handleDelete(patient.patientId)}
              >
                Delete
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                onClick={() => handleEdit(patient.patientId)}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientList;
