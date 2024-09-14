import React, { useEffect, useState } from 'react';
import { CUMedicalRecordDto, MedicalRecordDto } from '../../types/medicalRecordTypes';
import medicalRecordService from '../../services/medicalRecordService';
import { getAllPatients } from '../../services/patientService';
import { PatientDto } from '../../types/patientTypes';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const MedicalRecordsPage: React.FC = () => {
    const [records, setRecords] = useState<MedicalRecordDto[]>([]);
    const [patients, setPatients] = useState<PatientDto[]>([]);
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
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

    const generatePDF = () => {
        if (selectedPatientId === null) {
            setError('Please select a patient.');
            return;
        }
    
        const patientRecords = records.filter(record => record.patientId === selectedPatientId);
        const patient = patients.find(p => p.patientId === selectedPatientId);
    
        if (!patient) {
            setError('Selected patient not found.');
            return;
        }
    
        const doc = new jsPDF();
    
        doc.text(`Medical Records for ${patient.firstName} ${patient.lastName}`, 14, 16);
        doc.autoTable({
            startY: 20,
            head: [['ID', 'Patient ID', 'Name', 'Date', 'Details']],
            body: patientRecords.map(record => [
                record.id.toString(),
                record.patientId.toString(),
                `${patient.firstName} ${patient.lastName}`,
                record.recordDate,
                record.recordDetails
            ])
        });
    
        doc.save(`medical-records-${patient.firstName}-${patient.lastName}.pdf`);
    };
    

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Medical Records</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <label htmlFor="patientSelect" className="block text-gray-700 text-sm font-bold mb-2">Select Patient</label>
                <select
                    id="patientSelect"
                    value={selectedPatientId || ''}
                    onChange={(e) => setSelectedPatientId(Number(e.target.value))}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="">Select a patient</option>
                    {patients.map(patient => (
                        <option key={patient.patientId} value={patient.patientId}>
                            {patient.firstName} {patient.lastName}
                        </option>
                    ))}
                </select>

                <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mt-4"
                >
                    Create New Record
                </button>
                <button
                    onClick={generatePDF}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition ml-4 mt-4"
                >
                    Download PDF
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
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(record.id)}
                                        className="text-red-600 hover:text-red-900 ml-4"
                                    >
                                        Delete
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showCreateForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4">Create New Record</h2>
                        <div>
                            <label htmlFor="recordPatientId" className="block text-sm font-medium text-gray-700">Patient</label>
                            <select
                                id="recordPatientId"
                                value={newRecord.patientId}
                                onChange={(e) => setNewRecord({ ...newRecord, patientId: Number(e.target.value) })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">Select a patient</option>
                                {patients.map(patient => (
                                    <option key={patient.patientId} value={patient.patientId}>
                                        {patient.firstName} {patient.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="recordDate" className="block text-sm font-medium text-gray-700">Record Date</label>
                            <input
                                id="recordDate"
                                type="date"
                                value={newRecord.recordDate}
                                onChange={(e) => setNewRecord({ ...newRecord, recordDate: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="recordDetails" className="block text-sm font-medium text-gray-700">Record Details</label>
                            <textarea
                                id="recordDetails"
                                value={newRecord.recordDetails}
                                onChange={(e) => setNewRecord({ ...newRecord, recordDetails: e.target.value })}
                                rows={4}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleCreate}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                            >
                                Create Record
                            </button>
                            <button
                                onClick={() => setShowCreateForm(false)}
                                className="ml-4 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEditForm && editingRecord && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4">Edit Record</h2>
                        <div>
                            <label htmlFor="editRecordDate" className="block text-sm font-medium text-gray-700">Record Date</label>
                            <input
                                id="editRecordDate"
                                type="date"
                                value={editingRecord.recordDate}
                                onChange={(e) => setEditingRecord({ ...editingRecord, recordDate: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="editRecordDetails" className="block text-sm font-medium text-gray-700">Record Details</label>
                            <textarea
                                id="editRecordDetails"
                                value={editingRecord.recordDetails}
                                onChange={(e) => setEditingRecord({ ...editingRecord, recordDetails: e.target.value })}
                                rows={4}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleUpdate}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                            >
                                Update Record
                            </button>
                            <button
                                onClick={() => setShowEditForm(false)}
                                className="ml-4 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
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
