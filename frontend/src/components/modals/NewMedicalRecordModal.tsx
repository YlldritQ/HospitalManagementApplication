import React, { useEffect, useState } from 'react';
import { CUMedicalRecordDto } from '../../types/medicalRecordTypes';
import { CUPrescriptionDto, PrescriptionDto } from '../../types/prescriptionTypes';
import { createPrescription } from '../../services/prescriptionService';
import { getDoctors } from '../../services/doctorService'; // Import doctor service
import { getAllNurses } from '../../services/nurseService'; // Import nurse service
import { getAllPatients } from '../../services/patientService'; // Import patient service
import { DoctorDto } from '../../types/doctorTypes';
import { NurseDto } from '../../types/nurseTypes';
import { PatientDto } from '../../types/patientTypes';

interface NewMedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (recordDto: CUMedicalRecordDto) => Promise<void>;
}

const NewMedicalRecordModal: React.FC<NewMedicalRecordModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<CUMedicalRecordDto>({
    patientId: 0,
    recordDetails: '',
    doctorId: 0,
    nurseId: undefined,
    prescriptionId: undefined,
  });

  const [prescriptionData, setPrescriptionData] = useState<CUPrescriptionDto>({
    patientId: 0,
    doctorId: 0,
    dateIssued: new Date(),
    medicationName: '',
    dosage: '',
    instructions: '',
  });

  const [isCreatingPrescription, setIsCreatingPrescription] = useState(false);

  const [doctors, setDoctors] = useState<DoctorDto[]>([]);
  const [nurses, setNurses] = useState<NurseDto[]>([]);
  const [patients, setPatients] = useState<PatientDto[]>([]);

  // Fetch doctors, nurses, and patients when the modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchDoctorsNursesPatients = async () => {
        try {
          const [doctorData, nurseData, patientData] = await Promise.all([
            getDoctors(),
            getAllNurses(),
            getAllPatients(),
          ]);
          setDoctors(doctorData);
          setNurses(nurseData);
          setPatients(patientData);
        } catch (error) {
          console.error('Failed to fetch doctors, nurses, or patients:', error);
        }
      };
      fetchDoctorsNursesPatients();
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePrescriptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPrescriptionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let prescriptionId: number | undefined = undefined;

      // Only create a prescription if medicationName and dosage are provided
      if (prescriptionData.medicationName && prescriptionData.dosage) {
        setIsCreatingPrescription(true);

        // Use doctorId and patientId from formData for the prescription
        const newPrescriptionData: CUPrescriptionDto = {
          ...prescriptionData,
          patientId: formData.patientId, // Set from formData
          doctorId: formData.doctorId ?? 0, // Set from formData (fallback to 0 if undefined)
        };

        // Create the prescription
        const createdPrescription: PrescriptionDto = await createPrescription(newPrescriptionData);
        prescriptionId = createdPrescription.id;
        setIsCreatingPrescription(false);
      }

      // Create the medical record
      const recordDto: CUMedicalRecordDto = {
        ...formData,
        prescriptionId, // Attach the prescription ID if created
      };
      await onSubmit(recordDto);
      onClose();
    } catch (error) {
      console.error("Failed to create medical record or prescription:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md mx-auto overflow-hidden">
        <div className="flex flex-col h-screen max-h-[90vh]">
          <div className="flex-shrink-0 p-6">
            <h2 className="text-xl font-semibold mb-4">Create New Medical Record</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
                  Patient
                </label>
                <select
                  name="patientId"
                  id="patientId"
                  value={formData.patientId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  <option value="">Select a patient</option>
                  {patients.map((patient) => (
                    <option key={patient.patientId} value={patient.patientId}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="recordDetails" className="block text-sm font-medium text-gray-700">
                  Record Details
                </label>
                <textarea
                  name="recordDetails"
                  id="recordDetails"
                  value={formData.recordDetails}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>

              <div>
                <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">
                  Doctor
                </label>
                <select
                  name="doctorId"
                  id="doctorId"
                  value={formData.doctorId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  <option value="">Select a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.firstName} {doctor.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="nurseId" className="block text-sm font-medium text-gray-700">
                  Nurse
                </label>
                <select
                  name="nurseId"
                  id="nurseId"
                  value={formData.nurseId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="">Select a nurse</option>
                  {nurses.map((nurse) => (
                    <option key={nurse.id} value={nurse.id}>
                      {nurse.firstName} {nurse.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <h3 className="text-lg font-semibold mt-4">Prescription Details (if applicable)</h3>
                <div>
                  <label htmlFor="medicationName" className="block text-sm font-medium text-gray-700">
                    Medication Name
                  </label>
                  <input
                    type="text"
                    name="medicationName"
                    id="medicationName"
                    value={prescriptionData.medicationName}
                    onChange={handlePrescriptionChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">
                    Dosage
                  </label>
                  <input
                    type="text"
                    name="dosage"
                    id="dosage"
                    value={prescriptionData.dosage}
                    onChange={handlePrescriptionChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                    Instructions
                  </label>
                  <textarea
                    name="instructions"
                    id="instructions"
                    value={prescriptionData.instructions}
                    onChange={handlePrescriptionChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>

              <div className="flex-shrink-0 flex justify-end p-4 bg-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={isCreatingPrescription}
                >
                  {isCreatingPrescription ? 'Creating Prescription...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMedicalRecordModal;
