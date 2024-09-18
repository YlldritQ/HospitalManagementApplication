import axios, { AxiosResponse } from 'axios';
import axiosInstance from '../utils/axiosInstance'; // Import the centralized Axios instance
import { PrescriptionDto, CUPrescriptionDto } from '../types/prescriptionTypes'; // Import types for prescriptions
import { GeneralServiceResponseDto } from '../types/generalTypes'; // Import general response type

// Get all prescriptions
export const getAllPrescriptions = async (): Promise<PrescriptionDto[]> => {
  try {
    const response = await axiosInstance.get('/Prescription');
    return response.data as PrescriptionDto[];
  } catch (error) {
    handleError(error);
    return []; // Return an empty array in case of an error
  }
};

// Get a prescription by ID
export const getPrescriptionById = async (id: number): Promise<PrescriptionDto | null> => {
  try {
    const response = await axiosInstance.get(`/Prescription/${id}`);
    return response.data as PrescriptionDto;
  } catch (error) {
    handleError(error);
    return null; // Return null in case of an error
  }
};

// Create a new prescription
export const createPrescription = async (prescriptionDto: CUPrescriptionDto): Promise<PrescriptionDto> => {
  try {
    console.log(prescriptionDto);
    const response = await axiosInstance.post('/Prescription', prescriptionDto);
    console.log(response);
    return response.data as PrescriptionDto;
  } catch (error) {
    handleError(error);
    throw error; // Rethrow the error after logging it
  }
};

// Update an existing prescription
export const updatePrescription = async (id: number, prescriptionDto: CUPrescriptionDto): Promise<GeneralServiceResponseDto> => {
  try {
    const response: AxiosResponse<any> = await axiosInstance.put(`/Prescription/${id}`, prescriptionDto);
    // Assuming the response data contains the necessary properties, map them to GeneralServiceResponseDto
    const result: GeneralServiceResponseDto = {
      isSucceed: response.data.isSucceed,
      statusCode: response.data.statusCode,
      message: response.data.message
    };
    return result;
  } catch (error) {
    handleError(error);
    throw error; // Rethrow the error after logging it
  }
};

// Delete a prescription
export const deletePrescription = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/Prescription/${id}`);
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
