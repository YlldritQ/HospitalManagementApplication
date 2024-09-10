import React, { useEffect, useState } from 'react';
import { CUMedicalRecordDto, MedicalRecordDto } from '../../types/medicalRecordTypes';
import medicalRecordService from '../../services/medicalRecordService';
import { getAllPatients } from '../../services/patientService';
import { PatientDto } from '../../types/patientTypes';

const MedicalRecordsPage: React.FC = () => {
    const [records, setRecords] = useState<MedicalRecordDto[]>([]);
    const [patients, setPatients] = useState<PatientDto[]>([]);
    const [newRecord, setNewRecord] = useState<CUMedicalRecordDto>({
        patientId: 0,
        recordDate: '',
        recordDetails: ''
    });
    const [editingRecord, setEditingRecord] = useState<MedicalRecordDto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [sortColumn, setSortColumn] = useState<keyof MedicalRecordDto>('id');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');


    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const fetchedRecords = await medicalRecordService.getAllMedicalRecords();
                setRecords(fetchedRecords);
            } catch (error) {
                console.log(error);
                setError('Failed to fetch records.');
            }
        };

        const fetchPatients = async () => {
            try {
                const fetchedPatients = await getAllPatients();
                setPatients(fetchedPatients);
            } catch (error) {
                console.log(error);
                setError('Failed to fetch patients.');
            }
        };

        fetchRecords();
        fetchPatients();
    }, []);

    const handleCreate = async () => {
        try {
            const createdRecord = await medicalRecordService.createMedicalRecord(newRecord);
            setRecords(prevRecords => [...prevRecords, createdRecord]);
            setNewRecord({ patientId: 0, recordDate: '', recordDetails: '' });
            setShowCreateForm(false); // Optionally close the form
        } catch (error) {
            setError('Failed to create record.');
        }
    };

    const handleUpdate = async () => {
        if (editingRecord) {
            try {
                await medicalRecordService.updateMedicalRecord(editingRecord.id, editingRecord);
                setRecords(prevRecords => prevRecords.map(record =>
                    record.id === editingRecord.id ? editingRecord : record
                ));
                setEditingRecord(null);
                setShowEditForm(false); // Optionally close the form
            } catch (error) {
                setError('Failed to update record.');
            }
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await medicalRecordService.deleteMedicalRecord(id);
            setRecords(prevRecords => prevRecords.filter(record => record.id !== id));
        } catch (error) {
            setError('Failed to delete record.');
        }
    };
    const handleSort = (column: keyof MedicalRecordDto) => {
        const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(direction);
        setRecords(records.slice().sort((a, b) => {
            if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
            if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
            return 0;
        }));
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Medical Records</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Create New Record
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Existing Records</h2>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <button onClick={() => handleSort('id')} className="flex items-center">
                                    ID
                                    {sortColumn === 'id' && (sortDirection === 'asc' ? ' 🔽' : ' 🔼')}
                                </button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <button onClick={() => handleSort('patientId')} className="flex items-center">
                                    Patient ID
                                    {sortColumn === 'patientId' && (sortDirection === 'asc' ? ' 🔽' : ' 🔼')}
                                </button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <button onClick={() => handleSort('recordDate')} className="flex items-center">
                                    Date
                                    {sortColumn === 'recordDate' && (sortDirection === 'asc' ? ' 🔽' : ' 🔼')}
                                </button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <button onClick={() => handleSort('recordDetails')} className="flex items-center">
                                    Details
                                    {sortColumn === 'recordDetails' && (sortDirection === 'asc' ? ' 🔽' : ' 🔼')}
                                </button>
                            </th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {records.map((record) => (
                            <tr key={record.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.patientId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.recordDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.recordDetails}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => {
                                            setEditingRecord(record);
                                            setShowEditForm(true);
                                        }}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(record.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Create Form */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-2xl font-semibold mb-4">Create New Record</h2>
                        <label htmlFor="create-patient-id" className="block text-gray-700 mb-2">Patient:</label>
                        <select
                            id="create-patient-id"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            value={newRecord.patientId}
                            onChange={(e) => setNewRecord({ ...newRecord, patientId: Number(e.target.value) })}
                        >
                            <option value={0} disabled>Select a patient</option>
                            {patients.map(patient => (
                                <option key={patient.patientId} value={patient.patientId}>
                                    {patient.firstName} {patient.lastName}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="create-record-date" className="block text-gray-700 mb-2">Record Date:</label>
                        <input
                            id="create-record-date"
                            type="date"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            value={newRecord.recordDate}
                            onChange={(e) => setNewRecord({ ...newRecord, recordDate: e.target.value })}
                        />
                        <label htmlFor="create-record-details" className="block text-gray-700 mb-2">Record Details:</label>
                        <textarea
                            id="create-record-details"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            value={newRecord.recordDetails}
                            onChange={(e) => setNewRecord({ ...newRecord, recordDetails: e.target.value })}
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={handleCreate}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mr-2"
                            >
                                Create Record
                            </button>
                            <button
                                onClick={() => setShowCreateForm(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Form */}
            {showEditForm && editingRecord && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        {/* <h2 className="text-2xl font-semibold mb-4">Edit Record</h2>
                        <label htmlFor="edit-patient-id" className="block text-gray-700 mb-2">Patient ID:</label>
                        <input
                            id="edit-patient-id"
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            value={editingRecord.patientId}
                            onChange={(e) => setEditingRecord({ ...editingRecord, patientId: Number(e.target.value) })}
                        /> */}
                        <label htmlFor="edit-record-date" className="block text-gray-700 mb-2">Record Date:</label>
                        <input
                            id="edit-record-date"
                            type="date"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            value={editingRecord.recordDate}
                            onChange={(e) => setEditingRecord({ ...editingRecord, recordDate: e.target.value })}
                        />
                        <label htmlFor="edit-record-details" className="block text-gray-700 mb-2">Record Details:</label>
                        <textarea
                            id="edit-record-details"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            value={editingRecord.recordDetails}
                            onChange={(e) => setEditingRecord({ ...editingRecord, recordDetails: e.target.value })}
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={handleUpdate}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mr-2"
                            >
                                Update Record
                            </button>
                            <button
                                onClick={() => setShowEditForm(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicalRecordsPage;
