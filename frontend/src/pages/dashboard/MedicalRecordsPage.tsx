import React, { useEffect, useState } from "react";
import {
  CUMedicalRecordDto,
  MedicalRecordDto,
} from "../../types/medicalRecordTypes";
import medicalRecordService from "../../services/medicalRecordService";
import {
  getAllPatients,
  getPatientByUserId,
} from "../../services/patientService";
import { getDoctors } from "../../services/doctorService";
import { getAllNurses } from "../../services/nurseService";
import { PatientDto } from "../../types/patientTypes";
import { DoctorDto } from "../../types/doctorTypes";
import { NurseDto } from "../../types/nurseTypes";
import { getAllPrescriptions } from "../../services/prescriptionService"; // Import the service for fetching prescriptions
import { PrescriptionDto } from "../../types/prescriptionTypes"; // Import types for prescriptions
import jsPDF from "jspdf";
import "jspdf-autotable";
import NewMedicalRecordModal from "../../components/modals/NewMedicalRecordModal";
import useAuth from "../../hooks/useAuth.hook";

const MedicalRecordsPage: React.FC = () => {
  const [records, setRecords] = useState<MedicalRecordDto[]>([]);
  const [patients, setPatients] = useState<PatientDto[]>([]);
  const [patient, setPatient] = useState<PatientDto | null>();
  const [doctors, setDoctors] = useState<DoctorDto[]>([]);
  const [nurses, setNurses] = useState<NurseDto[]>([]);
  const { user: loggedInUser } = useAuth();
  const roles = loggedInUser?.roles;
  const userId = loggedInUser?.id;
  const [isModalOpen, setModalOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState<PrescriptionDto[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  );
  const [editingRecord, setEditingRecord] = useState<MedicalRecordDto | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [sortColumn, setSortColumn] = useState<keyof MedicalRecordDto>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch medical records based on the user's role
        let fetchedRecords;
        if (
          roles?.includes("Admin") ||
          roles?.includes("Doctor") ||
          roles?.includes("Nurse")
        ) {
          fetchedRecords = await medicalRecordService.getAllMedicalRecords();
        } else {
          fetchedRecords = await medicalRecordService.getMedicalRecordsByUserId(
            userId
          );
        }
        setRecords(fetchedRecords);

        // Fetch patients
        const fetchedPatients = await getAllPatients();
        setPatients(fetchedPatients);

        // Fetch doctors
        const fetchedDoctors = await getDoctors();
        setDoctors(fetchedDoctors);

        // Fetch nurses
        const fetchedNurses = await getAllNurses();
        setNurses(fetchedNurses);

        // Fetch prescriptions
        const allPrescriptions = await getAllPrescriptions();
        setPrescriptions(allPrescriptions);

        // Fetch patient for non-admin roles
        if (roles?.includes("Patient")) {
          const patient = await getPatientByUserId(userId);
          setPatient(patient);
        }
      } catch (error) {
        console.error(error);
        setError("Failed to fetch data.");
      }
    };

    fetchData();
  }, [roles, userId]); // Add `roles` and `userId` as dependencies

  const handleCreate = async (recordDto: CUMedicalRecordDto) => {
    try {
      console.log(recordDto);
      const newRecord = await medicalRecordService.createMedicalRecord(
        recordDto
      );
      setRecords([...records, newRecord]);
      setModalOpen(false); // Close modal after successful creation
    } catch (err) {
      setError("Failed to create new medical record.");
    }
  };

  const handleUpdate = async () => {
    if (editingRecord) {
      try {
        await medicalRecordService.updateMedicalRecord(
          editingRecord.id,
          editingRecord
        );
        setRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.id === editingRecord.id ? editingRecord : record
          )
        );
        setEditingRecord(null);
        setShowEditForm(false);
      } catch (error) {
        setError("Failed to update record.");
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await medicalRecordService.deleteMedicalRecord(id);
      setRecords((prevRecords) =>
        prevRecords.filter((record) => record.id !== id)
      );
    } catch (error) {
      setError("Failed to delete record.");
    }
  };

  const handleSort = (column: keyof MedicalRecordDto) => {
    const direction =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);

    setRecords(
      records.slice().sort((a, b) => {
        const aValue = a[column];
        const bValue = b[column];

        // Handle undefined or null values
        if (aValue === undefined || aValue === null)
          return direction === "asc" ? 1 : -1;
        if (bValue === undefined || bValue === null)
          return direction === "asc" ? -1 : 1;

        // Handle string comparison
        if (typeof aValue === "string" && typeof bValue === "string") {
          return direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        // Handle number comparison
        if (typeof aValue === "number" && typeof bValue === "number") {
          return direction === "asc" ? aValue - bValue : bValue - aValue;
        }

        // Handle Date comparison (assuming values are either Date objects or date strings)
        const aDate = new Date(aValue as string); // Cast string to Date
        const bDate = new Date(bValue as string);

        if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
          return direction === "asc"
            ? aDate.getTime() - bDate.getTime()
            : bDate.getTime() - aDate.getTime();
        }

        return 0; // Default case for other types
      })
    );
  };

  const generatePDF = () => {
    if (selectedPatientId === null) {
      setError("Please select a patient.");
      return;
    }

    const patientRecords = records.filter(
      (record) => record.patientId === selectedPatientId
    );
    const patient = patients.find((p) => p.patientId === selectedPatientId);

    if (!patient) {
      setError("Selected patient not found.");
      return;
    }

    const doc = new jsPDF();

    // Center the title and make it bold
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Medical Records for ${patient.firstName} ${patient.lastName}`,
      doc.internal.pageSize.getWidth() / 2,
      20,
      { align: "center" }
    );

    // Add a horizontal line under the title
    doc.setLineWidth(0.5);
    doc.line(15, 25, doc.internal.pageSize.getWidth() - 15, 25);

    // Patient Information Section
    doc.setFontSize(14);
    doc.text(`Patient Details:`, 14, 35);
    doc.setFontSize(12);
    doc.text(`ID: ${patient.patientId}`, 16, 42);
    doc.text(`Name: ${patient.firstName} ${patient.lastName}`, 16, 48);
    doc.text(
      `Date of Birth: ${new Date(patient.dateOfBirth).toLocaleDateString()}`,
      16,
      54
    );
    doc.text(`Gender: ${patient.gender || "Unknown"}`, 16, 60);
    doc.text(`Contact: ${patient.contactInfo || "N/A"}`, 16, 66);

    // Add space between patient details and medical records
    doc.setLineWidth(0.5);
    doc.line(15, 72, doc.internal.pageSize.getWidth() - 15, 72);
    doc.setFont("helvetica", "bold");
    doc.text(`Medical Records:`, 14, 80);
    doc.setFont("helvetica", "normal");

    let yPosition = 90; // Starting Y position for medical records

    patientRecords.forEach((record, index) => {
      const doctor = doctors.find((d) => d.id === record.doctorId);
      const nurse = nurses.find((n) => n.id === record.nurseId);
      const recordPrescriptions =
        record.prescriptionId !== undefined
          ? prescriptions.find((p) => p.id === record.prescriptionId)
            ? `${
                prescriptions.find((p) => p.id === record.prescriptionId)
                  ?.medicationName
              } (${
                prescriptions.find((p) => p.id === record.prescriptionId)
                  ?.dosage
              })`
            : "N/A"
          : "N/A";

      // Record Heading
      doc.setFont("helvetica", "bold");
      doc.text(`Record ${index + 1}:`, 14, yPosition);
      yPosition += 8;

      // Record Details in block format
      doc.setFont("helvetica", "normal");
      doc.text(
        `Date: ${new Date(record.recordDate).toLocaleString()}`,
        16,
        yPosition
      );
      yPosition += 6;
      doc.text(`Details: ${record.recordDetails}`, 16, yPosition);
      yPosition += 6;
      doc.text(
        `Doctor: ${
          doctor
            ? `${doctor.firstName} ${doctor.lastName} (Specialty: ${doctor.specialty})`
            : "N/A"
        }`,
        16,
        yPosition
      );
      yPosition += 6;
      doc.text(
        `Nurse: ${nurse ? `${nurse.firstName} ${nurse.lastName}` : "N/A"}`,
        16,
        yPosition
      );
      yPosition += 6;
      doc.text(`Prescriptions: ${recordPrescriptions || "N/A"}`, 16, yPosition);
      yPosition += 10; // Add some extra space between records

      // Add a line between records
      doc.setLineWidth(0.1);
      doc.line(
        15,
        yPosition - 2,
        doc.internal.pageSize.getWidth() - 15,
        yPosition - 2
      );
      yPosition += 6;
    });

    // Footer with generated date
    doc.setFontSize(10);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      14,
      doc.internal.pageSize.height - 10
    );

    // Save the PDF with a descriptive name
    doc.save(
      `medical-records-${patient.firstName}-${
        patient.lastName
      }-${new Date().getTime()}.pdf`
    );
  };

  const generatePrescriptionPDF = () => {
    if (selectedPatientId === null) {
      setError("Please select a patient.");
      return;
    }

    const patientRecords = records.filter(
      (record) => record.patientId === selectedPatientId
    );
    const patient = patients.find((p) => p.patientId === selectedPatientId);

    if (!patient) {
      setError("Selected patient not found.");
      return;
    }

    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Prescription Details for ${patient.firstName} ${patient.lastName}`,
      doc.internal.pageSize.getWidth() / 2,
      20,
      { align: "center" }
    );

    // Add a horizontal line under the title
    doc.setLineWidth(0.5);
    doc.line(15, 25, doc.internal.pageSize.getWidth() - 15, 25);

    // Patient Information Section
    doc.setFontSize(14);
    doc.text(`Patient Details:`, 14, 35);
    doc.setFontSize(12);
    doc.text(`Name: ${patient.firstName} ${patient.lastName}`, 16, 48);
    doc.text(
      `Date of Birth: ${new Date(patient.dateOfBirth).toLocaleDateString()}`,
      16,
      54
    );

    // Add space before records
    doc.setLineWidth(0.5);
    doc.line(15, 60, doc.internal.pageSize.getWidth() - 15, 60);
    doc.setFont("helvetica", "bold");
    doc.text(`Prescription Records:`, 14, 70);
    doc.setFont("helvetica", "normal");

    let yPosition = 80; // Starting Y position for records

    patientRecords.forEach((record) => {
      const doctor = doctors.find((d) => d.id === record.doctorId);
      const prescription = prescriptions.find(
        (p) => p.id === record.prescriptionId
      );

      // Record Details in block format
      doc.setFont("helvetica", "normal");
      doc.text(
        `Doctor: ${doctor ? `${doctor.firstName} ${doctor.lastName}` : "N/A"}`,
        16,
        yPosition
      );
      yPosition += 10;
      doc.text(
        `Prescription: ${
          prescription ? `${prescription.medicationName}` : "N/A"
        }`,
        16,
        yPosition
      );
      yPosition += 10; // Add space between records
      doc.text(
        `Dosage: ${prescription ? `${prescription.dosage}` : "N/A"}`,
        16,
        yPosition
      );
      yPosition += 10;
      doc.text(
        `Instructions: ${
          prescription ? `${prescription.instructions}` : "N/A"
        }`,
        16,
        yPosition
      );
      yPosition += 10;

      doc.text(
        `Date Issued: ${prescription ? `${prescription.dateIssued}` : "N/A"}`,
        16,
        yPosition
      );
      yPosition += 10;
      // Add a line between records
      doc.setLineWidth(0.1);
      doc.line(
        15,
        yPosition - 2,
        doc.internal.pageSize.getWidth() - 15,
        yPosition - 2
      );
      yPosition += 6;
    });

    // Footer with generated date
    doc.setFontSize(10);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      14,
      doc.internal.pageSize.height - 10
    );

    // Save the PDF
    doc.save(
      `prescription-records-${patient.firstName}-${
        patient.lastName
      }-${new Date().getTime()}.pdf`
    );
  };
  const generateMyPrescriptionPDF = () => {
    if (!patient) {
      setError("Selected patient not found.");
      return;
    }

    const patientRecords = records.filter(
      (record) => record.patientId === patient?.patientId
    );

    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Prescription Details for ${patient.firstName} ${patient.lastName}`,
      doc.internal.pageSize.getWidth() / 2,
      20,
      { align: "center" }
    );

    // Add a horizontal line under the title
    doc.setLineWidth(0.5);
    doc.line(15, 25, doc.internal.pageSize.getWidth() - 15, 25);

    // Patient Information Section
    doc.setFontSize(14);
    doc.text(`Patient Details:`, 14, 35);
    doc.setFontSize(12);
    doc.text(`Name: ${patient.firstName} ${patient.lastName}`, 16, 48);
    doc.text(
      `Date of Birth: ${new Date(patient.dateOfBirth).toLocaleDateString()}`,
      16,
      54
    );

    // Add space before records
    doc.setLineWidth(0.5);
    doc.line(15, 60, doc.internal.pageSize.getWidth() - 15, 60);
    doc.setFont("helvetica", "bold");
    doc.text(`Prescription Records:`, 14, 70);
    doc.setFont("helvetica", "normal");

    let yPosition = 80; // Starting Y position for records

    patientRecords.forEach((record) => {
      const doctor = doctors.find((d) => d.id === record.doctorId);
      const prescription = prescriptions.find(
        (p) => p.id === record.prescriptionId
      );

      // Record Details in block format
      doc.setFont("helvetica", "normal");
      doc.text(
        `Doctor: ${doctor ? `${doctor.firstName} ${doctor.lastName}` : "N/A"}`,
        16,
        yPosition
      );
      yPosition += 10;
      doc.text(
        `Prescription: ${
          prescription ? `${prescription.medicationName}` : "N/A"
        }`,
        16,
        yPosition
      );
      yPosition += 10; // Add space between records
      doc.text(
        `Dosage: ${prescription ? `${prescription.dosage}` : "N/A"}`,
        16,
        yPosition
      );
      yPosition += 10;
      doc.text(
        `Instructions: ${
          prescription ? `${prescription.instructions}` : "N/A"
        }`,
        16,
        yPosition
      );
      yPosition += 10;

      doc.text(
        `Date Issued: ${prescription ? `${prescription.dateIssued}` : "N/A"}`,
        16,
        yPosition
      );
      yPosition += 10;
      // Add a line between records
      doc.setLineWidth(0.1);
      doc.line(
        15,
        yPosition - 2,
        doc.internal.pageSize.getWidth() - 15,
        yPosition - 2
      );
      yPosition += 6;
    });

    // Footer with generated date
    doc.setFontSize(10);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      14,
      doc.internal.pageSize.height - 10
    );

    // Save the PDF
    doc.save(
      `prescription-records-${patient.firstName}-${
        patient.lastName
      }-${new Date().getTime()}.pdf`
    );
  };
  const generateMyRecordsPDF = () => {
    if (!patient) {
      setError("Selected patient not found.");
      return;
    }

    const patientRecords = records.filter(
      (record) => record.patientId === patient?.patientId
    );

    const doc = new jsPDF();

    // Center the title and make it bold
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Medical Records for ${patient.firstName} ${patient.lastName}`,
      doc.internal.pageSize.getWidth() / 2,
      20,
      { align: "center" }
    );

    // Add a horizontal line under the title
    doc.setLineWidth(0.5);
    doc.line(15, 25, doc.internal.pageSize.getWidth() - 15, 25);

    // Patient Information Section
    doc.setFontSize(14);
    doc.text(`Patient Details:`, 14, 35);
    doc.setFontSize(12);
    doc.text(`ID: ${patient.patientId}`, 16, 42);
    doc.text(`Name: ${patient.firstName} ${patient.lastName}`, 16, 48);
    doc.text(
      `Date of Birth: ${new Date(patient.dateOfBirth).toLocaleDateString()}`,
      16,
      54
    );
    doc.text(`Gender: ${patient.gender || "Unknown"}`, 16, 60);
    doc.text(`Contact: ${patient.contactInfo || "N/A"}`, 16, 66);

    // Add space between patient details and medical records
    doc.setLineWidth(0.5);
    doc.line(15, 72, doc.internal.pageSize.getWidth() - 15, 72);
    doc.setFont("helvetica", "bold");
    doc.text(`Medical Records:`, 14, 80);
    doc.setFont("helvetica", "normal");

    let yPosition = 90; // Starting Y position for medical records

    patientRecords.forEach((record, index) => {
      const doctor = doctors.find((d) => d.id === record.doctorId);
      const nurse = nurses.find((n) => n.id === record.nurseId);
      const recordPrescriptions =
        record.prescriptionId !== undefined
          ? prescriptions.find((p) => p.id === record.prescriptionId)
            ? `${
                prescriptions.find((p) => p.id === record.prescriptionId)
                  ?.medicationName
              } (${
                prescriptions.find((p) => p.id === record.prescriptionId)
                  ?.dosage
              })`
            : "N/A"
          : "N/A";

      // Record Heading
      doc.setFont("helvetica", "bold");
      doc.text(`Record ${index + 1}:`, 14, yPosition);
      yPosition += 8;

      // Record Details in block format
      doc.setFont("helvetica", "normal");
      doc.text(
        `Date: ${new Date(record.recordDate).toLocaleString()}`,
        16,
        yPosition
      );
      yPosition += 6;
      doc.text(`Details: ${record.recordDetails}`, 16, yPosition);
      yPosition += 6;
      doc.text(
        `Doctor: ${
          doctor
            ? `${doctor.firstName} ${doctor.lastName} (Specialty: ${doctor.specialty})`
            : "N/A"
        }`,
        16,
        yPosition
      );
      yPosition += 6;
      doc.text(
        `Nurse: ${nurse ? `${nurse.firstName} ${nurse.lastName}` : "N/A"}`,
        16,
        yPosition
      );
      yPosition += 6;
      doc.text(`Prescriptions: ${recordPrescriptions || "N/A"}`, 16, yPosition);
      yPosition += 10; // Add some extra space between records

      // Add a line between records
      doc.setLineWidth(0.1);
      doc.line(
        15,
        yPosition - 2,
        doc.internal.pageSize.getWidth() - 15,
        yPosition - 2
      );
      yPosition += 6;
    });

    // Footer with generated date
    doc.setFontSize(10);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      14,
      doc.internal.pageSize.height - 10
    );

    // Save the PDF with a descriptive name
    doc.save(
      `medical-records-${patient.firstName}-${
        patient.lastName
      }-${new Date().getTime()}.pdf`
    );

  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-4">
      <h1 className="text-3xl font-semibold mb-6 text-white">
        Medical Records
      </h1>
      {error && <p className="text-red-500">{error}</p>}


      {roles?.includes("Nurse") && (
        <div>
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={generatePDF}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition min-w-[150px]"
            >
              Download PDF
            </button>
            <label
              htmlFor="patientSelect"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Select Patient
            </label>
            <div>
              <select
                id="patientSelect"
                value={selectedPatientId || ""}
                onChange={(e) => setSelectedPatientId(Number(e.target.value))}
                className="shadow appearance-none border border-gray-600 rounded-lg px-4 py-2 pr-8 w-full text-gray-300 bg-gray-700 focus:outline-none focus:ring focus:ring-blue-600"
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient.patientId} value={patient.patientId}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-300">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <button
              onClick={generatePrescriptionPDF}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition min-w-[150px]"
            >
              Download Prescription
            </button>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Existing Records
            </h2>
            <table className="min-w-full bg-gray-800 table-auto border-collapse">
              <thead>
                <tr>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    <button
                      onClick={() => handleSort("id")}
                      className="flex items-center"
                    >
                      ID
                      {sortColumn === "id" &&
                        (sortDirection === "asc" ? " 🔽" : " 🔼")}
                    </button>
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    <button
                      onClick={() => handleSort("patientId")}
                      className="flex items-center"
                    >
                      Patient
                      {sortColumn === "patientId" &&
                        (sortDirection === "asc" ? " 🔽" : " 🔼")}
                    </button>
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    <button
                      onClick={() => handleSort("recordDate")}
                      className="flex items-center"
                    >
                      Date
                      {sortColumn === "recordDate" &&
                        (sortDirection === "asc" ? " 🔽" : " 🔼")}
                    </button>
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    <button
                      onClick={() => handleSort("recordDetails")}
                      className="flex items-center"
                    >
                      Details
                      {sortColumn === "recordDetails" &&
                        (sortDirection === "asc" ? " 🔽" : " 🔼")}
                    </button>
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    Doctor
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    Nurse
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    Prescription
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {records.map((record) => {
                  const patient = patients.find(
                    (p) => p.patientId === record.patientId
                  );
                  const doctor = doctors.find((d) => d.id === record.doctorId);
                  const nurse = nurses.find((n) => n.id === record.nurseId);
                  const prescription = prescriptions.find(
                    (p) => p.id === record.prescriptionId
                  );

                  return (
                    <tr key={record.id}>
                      <td className="px-4 py-2 text-gray-300">{record.id}</td>
                      <td className="px-4 py-2 text-gray-300">
                        {patient
                          ? `${patient.firstName} ${patient.lastName}`
                          : "N/A"}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {new Date(record.recordDate).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {record.recordDetails}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {doctor
                          ? `${doctor.firstName} ${doctor.lastName}`
                          : "N/A"}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {nurse ? `${nurse.firstName} ${nurse.lastName}` : "N/A"}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {prescription
                          ? `${prescription.medicationName} (${prescription.dosage})`
                          : "N/A"}
                      </td>
                      {/* <td className="px-4 py-2">
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
                  </td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {roles?.includes("Admin") && (
        <div>
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition min-w-[150px]"
            >
              Create New Record
            </button>
            <button
              onClick={generatePDF}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition min-w-[150px]"
            >
              Download PDF
            </button>
            <label
              htmlFor="patientSelect"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Select Patient
            </label>
            <div>
              <select
                id="patientSelect"
                value={selectedPatientId || ""}
                onChange={(e) => setSelectedPatientId(Number(e.target.value))}
                className="shadow appearance-none border border-gray-600 rounded-lg px-4 py-2 pr-8 w-full text-gray-300 bg-gray-700 focus:outline-none focus:ring focus:ring-blue-600"
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient.patientId} value={patient.patientId}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-300">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <button
              onClick={generatePrescriptionPDF}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition min-w-[150px]"
            >
              Download Prescription
            </button>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Existing Records
            </h2>
            <table className="min-w-full bg-gray-800 table-auto border-collapse">
              <thead>
                <tr>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    <button
                      onClick={() => handleSort("id")}
                      className="flex items-center"
                    >
                      ID
                      {sortColumn === "id" &&
                        (sortDirection === "asc" ? " 🔽" : " 🔼")}
                    </button>
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    <button
                      onClick={() => handleSort("patientId")}
                      className="flex items-center"
                    >
                      Patient
                      {sortColumn === "patientId" &&
                        (sortDirection === "asc" ? " 🔽" : " 🔼")}
                    </button>
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    <button
                      onClick={() => handleSort("recordDate")}
                      className="flex items-center"
                    >
                      Date
                      {sortColumn === "recordDate" &&
                        (sortDirection === "asc" ? " 🔽" : " 🔼")}
                    </button>
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    <button
                      onClick={() => handleSort("recordDetails")}
                      className="flex items-center"
                    >
                      Details
                      {sortColumn === "recordDetails" &&
                        (sortDirection === "asc" ? " 🔽" : " 🔼")}
                    </button>
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    Doctor
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    Nurse
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    Prescription
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {records.map((record) => {
                  const patient = patients.find(
                    (p) => p.patientId === record.patientId
                  );
                  const doctor = doctors.find((d) => d.id === record.doctorId);
                  const nurse = nurses.find((n) => n.id === record.nurseId);
                  const prescription = prescriptions.find(
                    (p) => p.id === record.prescriptionId
                  );

                  return (
                    <tr key={record.id}>
                      <td className="px-4 py-2 text-gray-300">{record.id}</td>
                      <td className="px-4 py-2 text-gray-300">
                        {patient
                          ? `${patient.firstName} ${patient.lastName}`
                          : "N/A"}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {new Date(record.recordDate).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {record.recordDetails}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {doctor
                          ? `${doctor.firstName} ${doctor.lastName}`
                          : "N/A"}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {nurse ? `${nurse.firstName} ${nurse.lastName}` : "N/A"}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {prescription
                          ? `${prescription.medicationName} (${prescription.dosage})`
                          : "N/A"}
                      </td>
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
        </div>
      )}

      {roles?.includes("Doctor") && (
        <div>
          <div className="flex items-center gap-4 mb-6">
          <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition min-w-[150px]"
            >
              Create New Record
            </button>
          
            <button
              onClick={generatePDF}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition min-w-[150px]"
            >
              Download PDF
            </button>
            <label
              htmlFor="patientSelect"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Select Patient
            </label>
            <div>
              <select
                id="patientSelect"
                value={selectedPatientId || ""}
                onChange={(e) => setSelectedPatientId(Number(e.target.value))}
                className="shadow appearance-none border border-gray-600 rounded-lg px-4 py-2 pr-8 w-full text-gray-300 bg-gray-700 focus:outline-none focus:ring focus:ring-blue-600"
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient.patientId} value={patient.patientId}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-300">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <button
              onClick={generatePrescriptionPDF}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition min-w-[150px]"
            >
              Download Prescription
            </button>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Existing Records
            </h2>
            <table className="min-w-full bg-gray-800 table-auto border-collapse">
              <thead>
                <tr>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    <button
                      onClick={() => handleSort("id")}
                      className="flex items-center"
                    >
                      ID
                      {sortColumn === "id" &&
                        (sortDirection === "asc" ? " 🔽" : " 🔼")}
                    </button>
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    <button
                      onClick={() => handleSort("patientId")}
                      className="flex items-center"
                    >
                      Patient
                      {sortColumn === "patientId" &&
                        (sortDirection === "asc" ? " 🔽" : " 🔼")}
                    </button>
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    <button
                      onClick={() => handleSort("recordDate")}
                      className="flex items-center"
                    >
                      Date
                      {sortColumn === "recordDate" &&
                        (sortDirection === "asc" ? " 🔽" : " 🔼")}
                    </button>
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    <button
                      onClick={() => handleSort("recordDetails")}
                      className="flex items-center"
                    >
                      Details
                      {sortColumn === "recordDetails" &&
                        (sortDirection === "asc" ? " 🔽" : " 🔼")}
                    </button>
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    Doctor
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    Nurse
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    Prescription
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {records.map((record) => {
                  const patient = patients.find(
                    (p) => p.patientId === record.patientId
                  );
                  const doctor = doctors.find((d) => d.id === record.doctorId);
                  const nurse = nurses.find((n) => n.id === record.nurseId);
                  const prescription = prescriptions.find(
                    (p) => p.id === record.prescriptionId
                  );

                  return (
                    <tr key={record.id}>
                      <td className="px-4 py-2 text-gray-300">{record.id}</td>
                      <td className="px-4 py-2 text-gray-300">
                        {patient
                          ? `${patient.firstName} ${patient.lastName}`
                          : "N/A"}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {new Date(record.recordDate).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {record.recordDetails}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {doctor
                          ? `${doctor.firstName} ${doctor.lastName}`
                          : "N/A"}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {nurse ? `${nurse.firstName} ${nurse.lastName}` : "N/A"}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {prescription
                          ? `${prescription.medicationName} (${prescription.dosage})`
                          : "N/A"}
                      </td>
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
        </div>
      )}

      {roles?.includes("Patient") && (
        <div>
          <div className="flex items-center gap-4 mb-6">
            
            <button
              onClick={generateMyRecordsPDF}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition min-w-[150px]"
            >
              Download PDF
            </button>
            {/* <label
              htmlFor="patientSelect"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Select Patient
            </label>
            <div> */}
            {/* <select
                id="patientSelect"
                value={selectedPatientId || ""}
                onChange={(e) => setSelectedPatientId(Number(e.target.value))}
                className="shadow appearance-none border border-gray-600 rounded-lg px-4 py-2 pr-8 w-full text-gray-300 bg-gray-700 focus:outline-none focus:ring focus:ring-blue-600"
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient.patientId} value={patient.patientId}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select> */}
            {/* <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-300">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div> */}
            <button
              onClick={generateMyPrescriptionPDF}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition min-w-[150px]"
            >
              Download Prescription
            </button>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Existing Records
            </h2>
            <table className="min-w-full bg-gray-800 table-auto border-collapse">
              <thead>
                <tr>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    <button
                      onClick={() => handleSort("id")}
                      className="flex items-center"
                    >
                      ID
                      {sortColumn === "id" &&
                        (sortDirection === "asc" ? " 🔽" : " 🔼")}
                    </button>
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    <button
                      onClick={() => handleSort("patientId")}
                      className="flex items-center"
                    >
                      Patient
                      {sortColumn === "patientId" &&
                        (sortDirection === "asc" ? " 🔽" : " 🔼")}
                    </button>
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    <button
                      onClick={() => handleSort("recordDate")}
                      className="flex items-center"
                    >
                      Date
                      {sortColumn === "recordDate" &&
                        (sortDirection === "asc" ? " 🔽" : " 🔼")}
                    </button>
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    <button
                      onClick={() => handleSort("recordDetails")}
                      className="flex items-center"
                    >
                      Details
                      {sortColumn === "recordDetails" &&
                        (sortDirection === "asc" ? " 🔽" : " 🔼")}
                    </button>
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    Doctor
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    Nurse
                  </th>
                  <th className="border-b px-4 py-2 text-left text-gray-300">
                    Prescription
                  </th>
                  {/* <th className="border-b px-4 py-2 text-left text-gray-300">
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {records.map((record) => {
                  const patient = patients.find(
                    (p) => p.patientId === record.patientId
                  );
                  const doctor = doctors.find((d) => d.id === record.doctorId);
                  const nurse = nurses.find((n) => n.id === record.nurseId);
                  const prescription = prescriptions.find(
                    (p) => p.id === record.prescriptionId
                  );

                  return (
                    <tr key={record.id}>
                      <td className="px-4 py-2 text-gray-300">{record.id}</td>
                      <td className="px-4 py-2 text-gray-300">
                        {patient
                          ? `${patient.firstName} ${patient.lastName}`
                          : "N/A"}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {new Date(record.recordDate).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {record.recordDetails}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {doctor
                          ? `${doctor.firstName} ${doctor.lastName}`
                          : "N/A"}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {nurse ? `${nurse.firstName} ${nurse.lastName}` : "N/A"}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {prescription
                          ? `${prescription.medicationName} (${prescription.dosage})`
                          : "N/A"}
                      </td>
                      {/* <td className="px-4 py-2">
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
                  </td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {showEditForm && editingRecord && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Edit Medical Record
            </h2>
            <div>
              <div className="mb-4">
                <label
                  htmlFor="recordDetailsEdit"
                  className="block text-sm font-medium text-gray-300"
                >
                  Record Details
                </label>
                <textarea
                  id="recordDetailsEdit"
                  value={editingRecord.recordDetails}
                  onChange={(e) =>
                    setEditingRecord({
                      ...editingRecord,
                      recordDetails: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="doctorIdEdit"
                  className="block text-sm font-medium text-gray-300"
                >
                  Doctor
                </label>
                <select
                  id="doctorIdEdit"
                  value={editingRecord.doctorId}
                  onChange={(e) =>
                    setEditingRecord({
                      ...editingRecord,
                      doctorId: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="0">Select a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.firstName} {doctor.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="nurseIdEdit"
                  className="block text-sm font-medium text-gray-300"
                >
                  Nurse
                </label>
                <select
                  id="nurseIdEdit"
                  value={editingRecord.nurseId}
                  onChange={(e) =>
                    setEditingRecord({
                      ...editingRecord,
                      nurseId: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="0">Select a nurse</option>
                  {nurses.map((nurse) => (
                    <option key={nurse.id} value={nurse.id}>
                      {nurse.firstName} {nurse.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="prescriptionIdEdit"
                  className="block text-sm font-medium text-gray-300"
                >
                  Prescription
                </label>
                <select
                  id="prescriptionIdEdit"
                  value={editingRecord.prescriptionId}
                  onChange={(e) =>
                    setEditingRecord({
                      ...editingRecord,
                      prescriptionId: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="0">Select a prescription</option>
                  {prescriptions.map((prescription) => (
                    <option key={prescription.id} value={prescription.id}>
                      {prescription.medicationName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
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
