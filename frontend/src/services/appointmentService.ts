import axiosInstance from "../utils/axiosInstance";
import axios, { AxiosResponse } from 'axios';
import { AppointmentDto, CUAppointmentDto } from '../types/appointmentTypes'; // Import necessary types
import { GeneralServiceResponseDto } from "../types/generalTypes";

// Get all appointments
export const getAppointments = async (): Promise<AppointmentDto[]> => {
  try {
    const response: AxiosResponse<AppointmentDto[]> = await axiosInstance.get('/Appointment');
    return response.data;
  } catch (error) {
    handleError(error, '/Appointment/GetAllAppointments');
    return []; // Return an empty array in case of an error
  }
};

// Get appointment by ID
export const getAppointmentById = async (id: number): Promise<AppointmentDto | null> => {
  try {
    const response: AxiosResponse<AppointmentDto> = await axiosInstance.get(`/Appointment/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, `/Appointment/${id}`);
    return null; // Return null in case of an error
  }
};

// Get appointment by Doctor ID
export const getAppointmentsByDoctorId = async (doctorId: number): Promise<AppointmentDto[]> => {
  try {
    const response: AxiosResponse<AppointmentDto[]> = await axiosInstance.get(`/Appointment/doctor/${doctorId}`);
    return response.data;
  } catch (error) {
    handleError(error, `/appointments?doctorId=${doctorId}`);
    return []; // Return an empty array in case of an error
  }
};

// Create a new appointment
export const createAppointment = async (appointmentDto: CUAppointmentDto): Promise<GeneralServiceResponseDto> => {
  try {
    const response: AxiosResponse<GeneralServiceResponseDto> = await axiosInstance.post('/Appointment', appointmentDto);
    return response.data;
  } catch (error) {
    handleError(error, '/Appointment');
    throw error; // Rethrow the error after logging it
  }
};

// Update an appointment
export const updateAppointment = async (id: number, appointmentDto: CUAppointmentDto): Promise<GeneralServiceResponseDto> => {
  try {
    const response: AxiosResponse<GeneralServiceResponseDto> = await axiosInstance.put(`/Appointment/${id}`, appointmentDto);
    return response.data; // Assume the response data already matches GeneralServiceResponseDto
  } catch (error) {
    handleError(error, `/Appointment/${id}`);
    throw error; // Rethrow the error after logging it
  }
};

// Delete an appointment
export const deleteAppointment = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/Appointment/${id}`);
  } catch (error) {
    handleError(error, `/Appointment/${id}`);
    throw error; // Rethrow the error after logging it
  }
};

// Handle Axios Errors
const handleError = (error: any, endpoint: string) => {
  if (axios.isAxiosError(error)) {
    // Log detailed error information
    console.error(`API call to ${endpoint} failed with status ${error.response?.status}: ${error.response?.statusText}`);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    throw new Error(error.response?.data?.message || error.response?.statusText || 'API call failed');
  } else {
    console.error(`Unknown error occurred during Axios fetch to ${endpoint}:`, error);
    throw new Error('Unknown error occurred during Axios fetch');
  }
};

