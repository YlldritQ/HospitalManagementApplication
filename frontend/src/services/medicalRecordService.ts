import axios from 'axios';
import { MedicalRecordDto, CUMedicalRecordDto } from '../types/medicalRecordTypes';

const API_URL = '/api/medical-records';

// Fetch all medical records
export const getMedicalRecords = async (): Promise<MedicalRecordDto[]> => {
    try {
        const response = await axios.get<MedicalRecordDto[]>(API_URL);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch medical records');
    }
};

// Fetch a single medical record by ID
export const getMedicalRecordById = async (id: number): Promise<MedicalRecordDto> => {
    try {
        const response = await axios.get<MedicalRecordDto>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch medical record');
    }
};

// Create a new medical record
export const createMedicalRecord = async (record: CUMedicalRecordDto): Promise<MedicalRecordDto> => {
    try {
        const response = await axios.post<MedicalRecordDto>(API_URL, record);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create medical record');
    }
};

// Update an existing medical record
export const updateMedicalRecord = async (id: number, record: CUMedicalRecordDto): Promise<MedicalRecordDto> => {
    try {
        const response = await axios.put<MedicalRecordDto>(`${API_URL}/${id}`, record);
        return response.data;
    } catch (error) {
        throw new Error('Failed to update medical record');
    }
};

// Delete a medical record by ID
export const deleteMedicalRecord = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        throw new Error('Failed to delete medical record');
    }
};
