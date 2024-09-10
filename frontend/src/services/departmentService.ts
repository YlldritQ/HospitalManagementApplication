import axios, { AxiosResponse } from 'axios'; // Import axios for error checking
import axiosInstance from '../utils/axiosInstance'; // Import the centralized Axios instance
import { DepartmentDto, CreateDepartmentDto } from '../types/departmentTypes'; // Import types from departmentTypes
import { GeneralServiceResponseDto } from '../types/generalTypes';

// Get all departments
export const getDepartments = async (): Promise<DepartmentDto[]> => {
  try {
    const response = await axiosInstance.get('/Department');
    console.log(response);
    return response.data as DepartmentDto[];
  } catch (error) {
    handleError(error);
    return []; // Return an empty array in case of an error
  }
};

// Get department by ID
export const getDepartmentById = async (id: number): Promise<DepartmentDto | null> => {
  try {
    const response = await axiosInstance.get(`/Department/${id}`);
    return response.data as DepartmentDto;
  } catch (error) {
    handleError(error);
    return null; // Return null in case of an error
  }
};

// Create a new department
export const createDepartment = async (departmentDto: CreateDepartmentDto): Promise<DepartmentDto> => {
  try {
    const response = await axiosInstance.post('/Department', departmentDto);
    return response.data as DepartmentDto;
  } catch (error) {
    handleError(error);
    throw error; // Rethrow the error after logging it
  }
};

// Update department
export const updateDepartment = async (id: number, departmentDto: DepartmentDto): Promise<GeneralServiceResponseDto> => {
  try {
    const response: AxiosResponse<any> = await axiosInstance.put(`/Department/${id}`, departmentDto);

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

// Delete department
export const deleteDepartment = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/Department/${id}`);
  } catch (error) {
    handleError(error);
    throw error; // Rethrow the error after logging it
  }
};

// Assign doctors to a department
export const addDoctorsToDepartment = async (departmentId: number, doctorIds: number[]): Promise<void> => {
  try {
    await axiosInstance.post(`/Department/${departmentId}/doctors`, { doctorIds });
  } catch (error) {
    handleError(error);
    throw error; // Rethrow the error after logging it
  }
};

// Remove doctors from a department
export const removeDoctorsFromDepartment = async (departmentId: number, doctorIds: number[]): Promise<void> => {
  try {
    await axiosInstance.delete(`/Department/${departmentId}/doctors`, { data: { doctorIds } });
  } catch (error) {
    handleError(error);
    throw error; // Rethrow the error after logging it
  }
};

// Assign nurses to a department
export const addNursesToDepartment = async (departmentId: number, nurseIds: number[]): Promise<void> => {
  try {
    await axiosInstance.post(`/Department/${departmentId}/nurses`, { nurseIds });
  } catch (error) {
    handleError(error);
    throw error; // Rethrow the error after logging it
  }
};

// Remove nurses from a department
export const removeNursesFromDepartment = async (departmentId: number, nurseIds: number[]): Promise<void> => {
  try {
    await axiosInstance.delete(`/Department/${departmentId}/nurses`, { data: { nurseIds } });
  } catch (error) {
    handleError(error);
    throw error; // Rethrow the error after logging it
  }
};

// Assign rooms to a department
export const addRoomsToDepartment = async (departmentId: number, roomIds: number[]): Promise<void> => {
  try {
    await axiosInstance.post(`/Department/${departmentId}/rooms`, { roomIds });
  } catch (error) {
    handleError(error);
    throw error; // Rethrow the error after logging it
  }
};

// Remove rooms from a department
export const removeRoomsFromDepartment = async (departmentId: number, roomIds: number[]): Promise<void> => {
  try {
    await axiosInstance.delete(`/Department/${departmentId}/rooms`, { data: { roomIds } });
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
