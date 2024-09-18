// types/medicalRecordTypes.ts

export interface MedicalRecordDto {
    id: number;
    patientId: number;
    recordDate: string;
    recordDetails: string;
    doctorId: number;
    nurseId?: number;
    prescriptionId?: number;
}

export interface CUMedicalRecordDto {
    patientId: number;
    recordDate: string;
    recordDetails: string;
    doctorId: number;
    nurseId?: number;
    prescriptionId?: number;
}
