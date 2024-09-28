import axiosInstance from '../utils/axiosInstance'; // Adjust the import path based on your project structure
import { CUMedicalRecordDto, MedicalRecordDto } from '../types/medicalRecordTypes'; // Adjust the import path as necessary

const API_BASE_URL = 'MedicalRecord'; // Adjust the base URL if needed

const medicalRecordService = {
    async getAllMedicalRecords(): Promise<MedicalRecordDto[]> {
        const response = await axiosInstance.get<MedicalRecordDto[]>(`${API_BASE_URL}`);
        return response.data;
    },

    async getMedicalRecordById(id: number): Promise<MedicalRecordDto> {
        const response = await axiosInstance.get<MedicalRecordDto>(`${API_BASE_URL}/${id}`);
        return response.data;
    },

    async createMedicalRecord(recordDto: CUMedicalRecordDto): Promise<MedicalRecordDto> {
        const response = await axiosInstance.post<MedicalRecordDto>(`${API_BASE_URL}`, recordDto);
        return response.data;
    },

    async updateMedicalRecord(id: number, recordDto: CUMedicalRecordDto): Promise<void> {
        await axiosInstance.put<void>(`${API_BASE_URL}/${id}`, recordDto);
    },

    async deleteMedicalRecord(id: number): Promise<void> {
        await axiosInstance.delete<void>(`${API_BASE_URL}/${id}`);
    },
    async getMedicalRecordsByUserId(id: string | undefined): Promise<MedicalRecordDto[]> {
        const response = await axiosInstance.get<MedicalRecordDto[]>(`${API_BASE_URL}/user/${id}`);
        return response.data;
    },
    
};

export default medicalRecordService;
