import React, { useState, useEffect } from "react";
import { getAllPatients, deletePatient } from "../../services/patientService";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.hook";

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
  const { user: loggedInUser } = useAuth()
  const roles = loggedInUser?.roles
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
    <div className="flex flex-col items-start justify-start p-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 min-h-screen w-full">
      { roles?.includes("Admin") && (
    <div className="flex flex-col items-start justify-start p-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 min-h-screen w-full">
    <h1 className="text-3xl font-bold text-white mb-8">Patient List</h1>
    
    <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden shadow-lg">
      <thead>
        <tr className="bg-gray-900 text-white">
          <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">ID</th>
          <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Name</th>
          <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Gender</th>
          <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Contact Info</th>
          <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Date of Birth</th>
          <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Actions</th>
        </tr>
      </thead>
      <tbody>
        {patients.map((patient) => (
          <tr key={patient.patientId} className="border-b border-gray-700">
            <td className="py-4 px-6 text-white">{patient.patientId}</td>
            <td className="py-4 px-6 text-white">{`${patient.firstName} ${patient.lastName}`}</td>
            <td className="py-4 px-6 text-white">{patient.gender}</td>
            <td className="py-4 px-6 text-white">{patient.contactInfo}</td>
            <td className="py-4 px-6 text-white">{patient.dateOfBirth.toDateString()}</td>
            <td className="py-4 px-6">
              <button
                onClick={() => handleEdit(patient.patientId)}
                className="text-blue-400 hover:underline mr-4 transition duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(patient.patientId)}
                className="text-red-400 hover:underline mr-4 transition duration-200"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

  </div>
      )}
      {(roles?.includes("Doctor") || roles?.includes("Nurse")) && (
        
    <div className="flex flex-col items-start justify-start p-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 min-h-screen w-full">
    <h1 className="text-3xl font-bold text-white mb-8">Patient List</h1>
    
    <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden shadow-lg">
      <thead>
        <tr className="bg-gray-900 text-white">
          <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">ID</th>
          <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Name</th>
          <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Gender</th>
          <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Contact Info</th>
          <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Date of Birth</th>
        </tr>
      </thead>
      <tbody>
        {patients.map((patient) => (
          <tr key={patient.patientId} className="border-b border-gray-700">
            <td className="py-4 px-6 text-white">{patient.patientId}</td>
            <td className="py-4 px-6 text-white">{`${patient.firstName} ${patient.lastName}`}</td>
            <td className="py-4 px-6 text-white">{patient.gender}</td>
            <td className="py-4 px-6 text-white">{patient.contactInfo}</td>
            <td className="py-4 px-6 text-white">{patient.dateOfBirth.toDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>

  </div>
      )}
    </div>
  );
  
};

export default PatientList;