import React, { useEffect, useState } from 'react';
import { CUMedicalRecordDto, MedicalRecordDto } from '../../types/medicalRecordTypes';
import medicalRecordService from '../../services/medicalRecordService';
import { getAllPatients } from '../../services/patientService';
import { getDoctors } from '../../services/doctorService';
import { getAllNurses } from '../../services/nurseService';
import { PatientDto } from '../../types/patientTypes';
import { DoctorDto } from '../../types/doctorTypes';
import { NurseDto } from '../../types/nurseTypes';
import { getAllPrescriptions } from '../../services/prescriptionService'; // Import the service for fetching prescriptions
import { PrescriptionDto } from '../../types/prescriptionTypes'; // Import types for prescriptions
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import NewMedicalRecordModal from '../../components/modals/NewMedicalRecordModal';

const MedicalRecordsPage: React.FC = () => {
    const [records, setRecords] = useState<MedicalRecordDto[]>([]);
    const [patients, setPatients] = useState<PatientDto[]>([]);
    const [doctors, setDoctors] = useState<DoctorDto[]>([]);
    const [nurses, setNurses] = useState<NurseDto[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [prescriptions, setPrescriptions] = useState<PrescriptionDto[]>([]);
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
    const [newRecord, setNewRecord] = useState<CUMedicalRecordDto>({
        patientId: 0,
        recordDate: '',
        recordDetails: '',
        doctorId: 0,
        nurseId: 0,
        prescriptionId: 0
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
                console.error(error);
                setError('Failed to fetch records.');
            }
        };

        const fetchPatients = async () => {
            try {
                const fetchedPatients = await getAllPatients();
                setPatients(fetchedPatients);
            } catch (error) {
                console.error(error);
                setError('Failed to fetch patients.');
            }
        };

        const fetchDoctors = async () => {
            try {
                const fetchedDoctors = await getDoctors();
                setDoctors(fetchedDoctors);
            } catch (error) {
                console.error(error);
                setError('Failed to fetch doctors.');
            }
        };

        const fetchNurses = async () => {
            try {
                const fetchedNurses = await getAllNurses();
                setNurses(fetchedNurses);
            } catch (error) {
                console.error(error);
                setError('Failed to fetch nurses.');
            }
        };


        const fetchPrescriptions = async () =>{
            try {
                const allPrescriptions = await getAllPrescriptions();
                setPrescriptions(allPrescriptions);
            } catch (error) {
                console.error(error);
                setError('Failed to fetch prescriptions.')
            }
        };

        fetchRecords();
        fetchPatients();
        fetchDoctors();
        fetchNurses();
        fetchPrescriptions();
    }, []);

    const handleCreate = async (recordDto: CUMedicalRecordDto) => {
         try {
            console.log(recordDto);
      const newRecord = await medicalRecordService.createMedicalRecord(recordDto);
      setRecords([...records, newRecord]);
      setModalOpen(false); // Close modal after successful creation
    } catch (err) {
      setError('Failed to create new medical record.');
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
                setShowEditForm(false);
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
            const aValue = a[column];
            const bValue = b[column];
    
            // Handle undefined or null values
            if (aValue === undefined || aValue === null) return direction === 'asc' ? 1 : -1;
            if (bValue === undefined || bValue === null) return direction === 'asc' ? -1 : 1;
    
            // Handle string comparison
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
    
            // Handle number comparison
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return direction === 'asc' ? aValue - bValue : bValue - aValue;
            }
    
            // Handle Date comparison (assuming values are either Date objects or date strings)
            const aDate = new Date(aValue as string); // Cast string to Date
            const bDate = new Date(bValue as string);
    
            if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
                return direction === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
            }
    
            return 0; // Default case for other types
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
    
        // Center the title and make it bold
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text(`Medical Records for ${patient.firstName} ${patient.lastName}`, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    
        // Add a horizontal line under the title
        doc.setLineWidth(0.5);
        doc.line(15, 25, doc.internal.pageSize.getWidth() - 15, 25);
    
        // Patient Information Section
        doc.setFontSize(14);
        doc.text(`Patient Details:`, 14, 35);
        doc.setFontSize(12);
        doc.text(`ID: ${patient.patientId}`, 16, 42);
        doc.text(`Name: ${patient.firstName} ${patient.lastName}`, 16, 48);
        doc.text(`Date of Birth: ${new Date(patient.dateOfBirth).toLocaleDateString()}`, 16, 54);
        doc.text(`Gender: ${patient.gender || 'Unknown'}`, 16, 60);
        doc.text(`Contact: ${patient.contactInfo || 'N/A'}`, 16, 66);
    
        // Add space between patient details and medical records
        doc.setLineWidth(0.5);
        doc.line(15, 72, doc.internal.pageSize.getWidth() - 15, 72);
        doc.setFont('helvetica', 'bold');
        doc.text(`Medical Records:`, 14, 80);
        doc.setFont('helvetica', 'normal');
    
        let yPosition = 90; // Starting Y position for medical records
    
        patientRecords.forEach((record, index) => {
            const doctor = doctors.find(d => d.id === record.doctorId);
            const nurse = nurses.find(n => n.id === record.nurseId);
            const recordPrescriptions = record.prescriptionId !== undefined
    ? prescriptions.find(p => p.id === record.prescriptionId)
        ? `${prescriptions.find(p => p.id === record.prescriptionId)?.medicationName} (${prescriptions.find(p => p.id === record.prescriptionId)?.dosage})`
        : 'N/A'
    : 'N/A';

    
            // Record Heading
            doc.setFont('helvetica', 'bold');
            doc.text(`Record ${index + 1}:`, 14, yPosition);
            yPosition += 8;
    
            // Record Details in block format
            doc.setFont('helvetica', 'normal');
            doc.text(`Date: ${new Date(record.recordDate).toLocaleString()}`, 16, yPosition);
            yPosition += 6;
            doc.text(`Details: ${record.recordDetails}`, 16, yPosition);
            yPosition += 6;
            doc.text(`Doctor: ${doctor ? `${doctor.firstName} ${doctor.lastName} (Specialty: ${doctor.specialty})` : 'N/A'}`, 16, yPosition);
            yPosition += 6;
            doc.text(`Nurse: ${nurse ? `${nurse.firstName} ${nurse.lastName}` : 'N/A'}`, 16, yPosition);
            yPosition += 6;
            doc.text(`Prescriptions: ${recordPrescriptions || 'N/A'}`, 16, yPosition);
            yPosition += 10; // Add some extra space between records
    
            // Add a line between records
            doc.setLineWidth(0.1);
            doc.line(15, yPosition - 2, doc.internal.pageSize.getWidth() - 15, yPosition - 2);
            yPosition += 6;
        });
    
        // Footer with generated date
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, doc.internal.pageSize.height - 10);
    
        // Save the PDF with a descriptive name
        doc.save(`medical-records-${patient.firstName}-${patient.lastName}-${new Date().getTime()}.pdf`);
    };
    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-semibold mb-6">Medical Records</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="flex items-center gap-4">
                <label htmlFor="patientSelect" className="block text-gray-700 text-sm font-bold mb-2">Select Patient</label>
                <select
                    id="patientSelect"
                    value={selectedPatientId || ''}
                    onChange={(e) => setSelectedPatientId(Number(e.target.value))}
                    className="border rounded-lg px-4 py-2 w-full"
                >
                    <option value="">Select a patient</option>
                    {patients.map(patient => (
                        <option key={patient.patientId} value={patient.patientId}>
                            {patient.firstName} {patient.lastName}
                        </option>
                    ))}
                </select>

                <button
        onClick={() => setModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md mb-4"
      >
                    Create New Record
                </button>
                <button
                    onClick={generatePDF}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                    Download PDF
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold mb-4">Existing Records</h2>
                    <table className="min-w-full bg-white table-auto border-collapse">
                   <thead>
            <tr>
                <th className="border-b px-4 py-2 text-left text-gray-600">
                    <button onClick={() => handleSort('id')} className="flex items-center">
                        ID
                        {sortColumn === 'id' && (sortDirection === 'asc' ? ' 🔽' : ' 🔼')}
                    </button>
                </th>
                <th className="border-b px-4 py-2 text-left text-gray-600">
                    <button onClick={() => handleSort('patientId')} className="flex items-center">
                        Patient 
                        {sortColumn === 'patientId' && (sortDirection === 'asc' ? ' 🔽' : ' 🔼')}
                    </button>
                            </th>
                            <th className="border-b px-4 py-2 text-left text-gray-600">
                    <button onClick={() => handleSort('recordDate')} className="flex items-center">
                        Date
                        {sortColumn === 'recordDate' && (sortDirection === 'asc' ? ' 🔽' : ' 🔼')}
                    </button>
                </th>
                <th className="border-b px-4 py-2 text-left text-gray-600">
                    <button onClick={() => handleSort('recordDetails')} className="flex items-center">
                        Details
                        {sortColumn === 'recordDetails' && (sortDirection === 'asc' ? ' 🔽' : ' 🔼')}
                    </button>
                </th>
                <th className="border-b px-4 py-2 text-left text-gray-600">
                    Doctor
                </th>
                <th className="border-b px-4 py-2 text-left text-gray-600">
                    Nurse
                </th>
                <th className="border-b px-4 py-2 text-left text-gray-600">
                    Prescription
                </th>
                <th className="border-b px-4 py-2 text-left text-gray-600">
                    Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {records.map(record => {
                            const patient = patients.find(patient => patient.patientId === record.patientId);
                            const doctor = doctors.find(d => d.id === record.doctorId);
                            const nurse = nurses.find(n => n.id === record.nurseId);
                            const prescription = prescriptions.find(p => p.id === record.prescriptionId);

                            return (
                                <tr key={record.id}>
                                    <td className="px-4 py-2">{record.id}</td>
                                    <td className="px-4 py-2">{patient ? `${patient.firstName} ${patient.lastName}` : 'N/A'}</td>
                                    <td className="px-4 py-2">{record.recordDate}</td>
                                    <td className="px-4 py-2">{record.recordDetails}</td>
                                    <td className="px-4 py-2">{doctor ? `${doctor.firstName} ${doctor.lastName}` : 'N/A'}</td>
                                    <td className="px-4 py-2">{nurse ? `${nurse.firstName} ${nurse.lastName}` : 'N/A'}</td>
                                    <td className="px-4 py-2">{prescription ? `${prescription.medicationName} (${prescription.dosage})` : 'N/A'}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => {
                                                setEditingRecord(record);
                                                setShowEditForm(true);
                                            }}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out shadow-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(record.id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out shadow-sm ml-4"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {showEditForm && editingRecord && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-2xl font-semibold mb-4">Edit Medical Record</h2>
                        <div className="mb-4">
                            <label htmlFor="recordDateEdit" className="block text-gray-700">Record Date</label>
                            <input
                                id="recordDateEdit"
                                type="date"
                                value={editingRecord.recordDate}
                                onChange={(e) => setEditingRecord({ ...editingRecord, recordDate: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="recordDetailsEdit" className="block text-gray-700">Record Details</label>
                            <textarea
                                id="recordDetailsEdit"
                                value={editingRecord.recordDetails}
                                onChange={(e) => setEditingRecord({ ...editingRecord, recordDetails: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="doctorIdEdit" className="block text-gray-700">Doctor</label>
                            <select
                                id="doctorIdEdit"
                                value={editingRecord.doctorId}
                                onChange={(e) => setEditingRecord({ ...editingRecord, doctorId: Number(e.target.value) })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="0">Select a doctor</option>
                                {doctors.map(doctor => (
                                    <option key={doctor.id} value={doctor.id}>
                                        {doctor.firstName} {doctor.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="nurseIdEdit" className="block text-gray-700">Nurse</label>
                            <select
                                id="nurseIdEdit"
                                value={editingRecord.nurseId}
                                onChange={(e) => setEditingRecord({ ...editingRecord, nurseId: Number(e.target.value) })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="0">Select a nurse</option>
                                {nurses.map(nurse => (
                                    <option key={nurse.id} value={nurse.id}>
                                        {nurse.firstName} {nurse.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="prescriptionIdEdit" className="block text-gray-700">Prescription ID</label>
                            <input
                                id="prescriptionIdEdit"
                                type="number"
                                value={editingRecord.prescriptionId || ''}
                                onChange={(e) => setEditingRecord({ ...editingRecord, prescriptionId: Number(e.target.value) })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <button
                            onClick={handleUpdate}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mr-2"
                        >
                            Update
                        </button>
                        <button
                            onClick={() => setShowEditForm(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            <NewMedicalRecordModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />
        </div>
    );
};

export default MedicalRecordsPage;
