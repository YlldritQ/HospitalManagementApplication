import axiosInstance from "../utils/axiosInstance";
import axios from 'axios';
import { AppointmentDto, CUAppointmentDto, GeneralServiceResponseDto } from '../types/appointmentTypes'; // Import necessary types

// Get all appointments
export const getAppointments = async (): Promise<AppointmentDto[]> => {
  try {
    const response = await axiosInstance.get('/Appointment/GetAllAppointments');
    return response.data as AppointmentDto[];
  } catch (error) {
    handleError(error);
    return []; // Return an empty array in case of an error
  }
};

// Get appointment by ID
export const getAppointmentById = async (id: number): Promise<AppointmentDto | null> => {
  try {
    const response = await axiosInstance.get(`/Appointment/${id}`);
    return response.data as AppointmentDto;
  } catch (error) {
    handleError(error);
    return null; // Return null in case of an error
  }
};

// Create a new appointment
export const createAppointment = async (appointmentDto: CUAppointmentDto): Promise<GeneralServiceResponseDto> => {
  try {
    const response = await axiosInstance.post('/Appointment', appointmentDto);
    return response.data as GeneralServiceResponseDto;
  } catch (error) {
    handleError(error);
    throw error; // Rethrow the error after logging it
  }
};

// Update an appointment
export const updateAppointment = async (id: number, appointmentDto: CUAppointmentDto): Promise<GeneralServiceResponseDto> => {
  try {
    const response: AxiosResponse<any> = await axiosInstance.put(`/Appointment/${id}`, appointmentDto);

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

// Delete an appointment
export const deleteAppointment = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/Appointment/${id}`);
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
