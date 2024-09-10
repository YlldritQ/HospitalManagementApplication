
export interface CUMedicalRecordDto {
    patientId: number;
    recordDate: string;  // ISO 8601 format date
    recordDetails: string;
}

export interface MedicalRecordDto {
    id: number;
    patientId: number;
    recordDate: string;  // ISO 8601 format date
    recordDetails: string;
}
