import axios from 'axios'; // Import axios for error checking
import axiosInstance from '../utils/axiosInstance';
import { DoctorDto, CUDoctorDto, DoctorRoomManagementDto } from '../types/doctorTypes'; // Import types from doctorTypes

// Get all doctors
export const getDoctors = async (): Promise<DoctorDto[]> => {
  try {
    const response = await axiosInstance.get('/Doctor');
    return response.data as DoctorDto[];
  } catch (error) {
    handleError(error);
    return []; // Return an empty array in case of an error
  }
};

// Get doctor by ID
export const getDoctorById = async (id: number): Promise<DoctorDto | null> => {
  try {
    const response = await axiosInstance.get(`/Doctor/${id}`);
    return response.data as DoctorDto;
  } catch (error) {
    handleError(error);
    return null; // Return null in case of an error
  }
};

// Create a new doctor
export const createDoctor = async (doctorDto: CUDoctorDto): Promise<DoctorDto> => {
  try {
    const response = await axiosInstance.post('/Doctor', doctorDto);
    return response.data as DoctorDto;
  } catch (error) {
    handleError(error);
    throw error; // Rethrow the error after logging it
  }
};

// Update doctor
export const updateDoctor = async (id: number, doctorDto: CUDoctorDto): Promise<void> => {
  try {
    await axiosInstance.put(`/Doctor/${id}`, doctorDto);
  } catch (error) {
    handleError(error);
    throw error; // Rethrow the error after logging it
  }
};

// Delete doctor
export const deleteDoctor = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/Doctor/${id}`);
  } catch (error) {
    handleError(error);
    throw error; // Rethrow the error after logging it
  }
};

// Assign rooms to a doctor
export const assignRoomsToDoctor = async (doctorId: number, doctorRoomDto: DoctorRoomManagementDto): Promise<void> => {
  try {
    await axiosInstance.post(`${doctorId}/rooms`, doctorRoomDto);
  } catch (error) {
    handleError(error);
    throw error; // Rethrow the error after logging it
  }
};

// Remove rooms from a doctor
export const removeRoomsFromDoctor = async (doctorId: number, doctorRoomDto: DoctorRoomManagementDto): Promise<void> => {
  try {
    await axiosInstance.delete(`${doctorId}/rooms`, { data: doctorRoomDto });
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
