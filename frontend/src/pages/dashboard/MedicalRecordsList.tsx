import React, { useState, useEffect } from "react";
import { getMedicalRecords } from "../../services/medicalRecordService";
import { MedicalRecordDto } from "../../types/medicalRecordTypes";

const MedicalRecordsList: React.FC = () => {
    const [records, setRecords] = useState<MedicalRecordDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const data = await getMedicalRecords();
                setRecords(data);
            } catch (err) {
                setError('Failed to fetch medical records');
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            
            <h1 className="text-xl font-semibold mb-4">Medical Records</h1>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Patient ID</th>
                        <th className="py-2 px-4 border-b">Record Date</th>
                        <th className="py-2 px-4 border-b">Record Details</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map(record => (
                        <tr key={record.Id}>
                            <td className="py-2 px-4 border-b">{record.Id}</td>
                            <td className="py-2 px-4 border-b">{record.PatientId}</td>
                            <td className="py-2 px-4 border-b">{record.RecordDate}</td>
                            <td className="py-2 px-4 border-b">{record.RecordDetails}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MedicalRecordsList;
