import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMedicalRecords, deleteMedicalRecord } from '../../services/medicalRecordService';
import { MedicalRecordDto } from '../../types/medicalRecordTypes';
import { toast, Toaster } from 'react-hot-toast';
import { formatDate } from '../../utils/dateUtiles';

const MedicalRecordList: React.FC = () => {
    const [medicalRecords, setMedicalRecords] = useState<MedicalRecordDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMedicalRecords = async () => {
            try {
                const data = await getMedicalRecords();
                setMedicalRecords(data);
            } catch (err) {
                setError('Failed to fetch medical records');
                toast.error('Failed to fetch medical records');
            } finally {
                setLoading(false);
            }
        };

        fetchMedicalRecords();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await deleteMedicalRecord(id);
            setMedicalRecords(medicalRecords.filter(record => record.Id !== id));
            toast.success('Medical record deleted successfully');
        } catch (err) {
            toast.error('Failed to delete medical record');
        }
    };

    const handleButtonClick = (id: number) => {
        navigate(`/dashboard/edit-medical-record/${id}`);
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-600">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Medical Record List</h1>
            <div className="mb-4">
                <button
                    onClick={() => navigate('/dashboard/edit-medical-record/new')}
                    className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Add New Record
                </button>
            </div>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="w-full bg-gray-200 text-left">
                        <th className="py-3 px-4 border-b">ID</th>
                        <th className="py-3 px-4 border-b">Patient ID</th>
                        <th className="py-3 px-4 border-b">Record Date</th>
                        <th className="py-3 px-4 border-b">Record Details</th>
                        <th className="py-3 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {medicalRecords.map(record => (
                        <tr key={record.Id} className="border-b">
                            <td className="py-3 px-4">{record.Id}</td>
                            <td className="py-3 px-4">{record.PatientId}</td>
                            <td className="py-3 px-4">{formatDate(record.RecordDate)}</td>
                            <td className="py-3 px-4">{record.RecordDetails}</td>
                            <td className="py-3 px-4">
                                <button
                                    onClick={() => handleButtonClick(record.Id)}
                                    className="text-blue-500 hover:underline mr-3"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(record.Id)}
                                    className="text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Toaster />
        </div>
    );
};

export default MedicalRecordList;
