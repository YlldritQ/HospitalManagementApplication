export interface CUPatientDto {
    firstName: string;
    lastName: string;
    dateOfBirth: Date; // Use Date type in TypeScript
    gender: string;
    contactInfo: string;
}

export interface PatientDto {
    patientId: number;
    firstName: string;
    lastName: string;
    dateOfBirth: Date; // Use Date type in TypeScript
    gender: string;
    contactInfo: string;
    userId: string;
}