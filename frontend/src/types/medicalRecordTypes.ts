// Define the structure of a Medical Record
export interface MedicalRecordDto {
    Id: number;                      // Unique identifier for the medical record
    PatientId: number;              // Identifier for the patient associated with this record
    RecordDate: string;             // Date of the medical record
    RecordDetails: string;          // Details of the medical record
    Patient: {                       // Patient information related to this medical record
        Id: number;                  // Unique identifier for the patient
        FirstName: string;           // Patient's first name
        LastName: string;            // Patient's last name
        Gender: string;              // Patient's gender
        ContactInfo: string;         // Patient's contact information
        DateOfBirth: string;         // Patient's date of birth
        // Other patient details as needed
    };
}

// Define the structure for creating or updating a medical record
export interface CUMedicalRecordDto {
    PatientId: number;              // Identifier for the patient associated with this record
    RecordDate: string;             // Date of the medical record
    RecordDetails: string;          // Details of the medical record
    Patient: {                       // Patient information related to this medical record
        Id: number;                  // Unique identifier for the patient
        FirstName: string;           // Patient's first name
        LastName: string;            // Patient's last name
        Gender: string;              // Patient's gender
        ContactInfo: string;         // Patient's contact information
        DateOfBirth: string;         // Patient's date of birth
        // Other patient details as needed
    };
}
