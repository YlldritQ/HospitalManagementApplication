import axiosInstance from "../utils/axiosInstance";
import axios, { AxiosResponse } from 'axios';
import { AppointmentDto, CUAppointmentDto } from '../types/appointmentTypes'; // Import necessary types
import { GeneralServiceResponseDto } from "../types/generalTypes";
import toast from "react-hot-toast";


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

export const getAppointmentByUserId = async (id: String | undefined): Promise<AppointmentDto[]> => {
  try {
    const response = await axiosInstance.get(`/Appointment/GetAppointmentsByUser/${id}`);
    return response.data as AppointmentDto[];
  } catch (error) {
    handleError(error);
    return []; // Return null in case of an error
  }
};

export const getAppointmentsByDoctorId = async (doctorId: number): Promise<AppointmentDto[]> => {
  try {
    const response: AxiosResponse<AppointmentDto[]> = await axiosInstance.get(`/Appointment/doctor/${doctorId}`);
    return response.data;
  } catch (error) {
    handleError(error);
    return []; // Return an empty array in case of an error
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
    toast.success("Deleted successfuly");
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