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
        <h1 className="text-2xl font-bold mb-4">Patient List</h1>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
                <tr className="w-full bg-gray-200 text-left">
                    <th className="py-3 px-4 border-b">ID</th>
                    <th className="py-3 px-4 border-b">Name</th>
                    <th className="py-3 px-4 border-b">Gender</th>
                    <th className="py-3 px-4 border-b">Contact Info</th>
                    <th className="py-3 px-4 border-b">Date of birth</th>
                    <th className="py-3 px-4 border-b">Actions</th>
                </tr>
            </thead>
            <tbody>
            {patients.map((patient) => (
                    <tr key={patient.patientId} className="border-b">
                        <td className="py-3 px-4">{patient.patientId}</td>
                        <td className="py-3 px-4">{`${patient.firstName} ${patient.lastName}`}</td>
                        <td className="py-3 px-4">{patient.gender}</td>
                        <td className="py-3 px-4">{patient.contactInfo}</td>
                        <td className="py-3 px-4">
                            {patient.dateOfBirth.toDateString()}
                        </td>
                        <td className="py-3 px-4">
                            <button
                                onClick={() => handleEdit(patient.patientId)}
                                className="text-blue-500 hover:underline mr-3"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(patient.patientId)}
                                className="text-red-500 hover:underline mr-3"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        
    </div>
);
};

export default PatientList;