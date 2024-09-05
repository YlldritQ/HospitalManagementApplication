// DoctorList.tsx
import React, { useState, useEffect } from 'react';
import { getDoctors } from '../../services/doctorService';

// Define a type for a doctor
interface Doctor {
  id: number;
  name: string;
  specialty: string;
  // Add other doctor properties as needed
}

const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const fetchedDoctors = await getDoctors();
        setDoctors(fetchedDoctors); // Successfully fetch and update state
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false); // Set loading to false after API call finishes
      }
    };

    fetchDoctors();
  }, []); // Empty dependency array, so it only runs once on mount

  // Handle loading state
  if (loading) return <p>Loading...</p>;
  
  // Handle error state
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Doctor List</h1>
      <ul>
        {doctors.map((doctor) => (
          <li key={doctor.id}>
            <h2>{doctor.name}</h2>
            <p>Specialty: {doctor.specialty}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorList;
