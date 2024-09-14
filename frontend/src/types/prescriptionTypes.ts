// types/prescriptionTypes.ts

export interface PrescriptionDto {
    id: number;
    patientId: number;
    patientName: string;
    doctorId: number;
    doctorName: string;
    dateIssued: Date;
    medicationName: string;
    dosage: string;
    instructions: string;
}

export interface CUPrescriptionDto {
    patientId: number;
    doctorId: number;
    dateIssued: Date;
    medicationName: string;
    dosage: string;
    instructions: string;
}
