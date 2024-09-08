import axios from 'axios';
import axiosInstance from '../utils/axiosInstance'; // Import the centralized Axios instance
import { CUPatientDto, PatientDto } from '../types/patientTypes'; // Import types from patientTypes
import { GeneralServiceResponseDto } from '../types/generalTypes';

// Get all patients
export const getAllPatients = async (): Promise<PatientDto[]> => {
  try {
    const response = await axiosInstance.get('/Patient');
    return response.data as PatientDto[];
  } catch (error) {
    handleError(error);
    return []; // Return an empty array in case of an error
  }
};

// Get patient by ID
export const getPatientById = async (patientId: number): Promise<PatientDto | null> => {
  try {
    const response = await axiosInstance.get(`/Patient/${patientId}`);
    return response.data as PatientDto;
  } catch (error) {
    handleError(error);
    return null; // Return null in case of an error
  }
};

// Create a new patient
export const createPatient = async (patientDto: CUPatientDto): Promise<GeneralServiceResponseDto> => {
  try {
    const response = await axiosInstance.post('/Patient', patientDto);
    return response.data as GeneralServiceResponseDto;
  } catch (error) {
    handleError(error);
    throw error; // Rethrow the error after logging it
  }
};

// Update patient
export const updatePatient = async (patientId: number, patientDto: CUPatientDto): Promise<GeneralServiceResponseDto> => {
  try {
    const response = await axiosInstance.put(`/Patient/${patientId}`, patientDto);
    return response.data as GeneralServiceResponseDto;
  } catch (error) {
    handleError(error);
    throw error; // Rethrow the error after logging it
  }
};

// Delete patient
export const deletePatient = async (patientId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/Patient/${patientId}`);
  } catch (error) {
    handleError(error);
    throw error; // Rethrow the error after logging it
  }
};

// Handle Axios Errors
const handleError = (error: any) => {
  if (axios.isAxiosError(error)) {
    console.error(`API call failed with status ${error.response?.status}: ${error.response?.statusText}`);
    throw new Error(error.response?.statusText || 'API call failed');
  } else {
    console.error('Unknown error occurred during Axios fetch');
    throw new Error('Unknown error occurred during Axios fetch');
  }
};
