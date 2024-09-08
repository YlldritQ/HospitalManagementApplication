import axiosInstance from '../utils/axiosInstance';
import { NurseDto, CUNurseDto, NurseRoomAssignmentDto } from '../types/nurseTypes'; // Adjust import if necessary
import axios, { AxiosResponse } from 'axios';
import { GeneralServiceResponseDto } from '../types/generalTypes';

// Fetch all nurses
export const getAllNurses = async (): Promise<NurseDto[]> => {
  try {
    const response = await axiosInstance.get<NurseDto[]>('/nurse');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`API call failed with status ${error.response?.status}: ${error.response?.statusText}`);
      throw new Error(error.response?.statusText || 'API call failed');
    } else {
      console.error('Unknown error occurred during Axios fetch');
      throw new Error('Unknown error occurred during Axios fetch');
    }
  }
};

// Fetch nurse by ID
export const getNurseById = async (id: number): Promise<NurseDto> => {
  try {
    const response = await axiosInstance.get<NurseDto>(`/nurse/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`API call failed with status ${error.response?.status}: ${error.response?.statusText}`);
      throw new Error(error.response?.statusText || 'API call failed');
    } else {
      console.error('Unknown error occurred during Axios fetch');
      throw new Error('Unknown error occurred during Axios fetch');
    }
  }
};

// Create a new nurse
export const createNurse = async (nurseDto: CUNurseDto): Promise<NurseDto> => {
  try {
    const response = await axiosInstance.post<NurseDto>('/nurse', nurseDto);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`API call failed with status ${error.response?.status}: ${error.response?.statusText}`);
      throw new Error(error.response?.statusText || 'Failed to create nurse');
    } else {
      console.error('Unknown error occurred during Axios fetch');
      throw new Error('Unknown error occurred during Axios fetch');
    }
  }
};

// Update a nurse
export const updateNurse = async (id: number, nurseDto: CUNurseDto): Promise<GeneralServiceResponseDto> => {
  try {
    const response: AxiosResponse<any> = await axiosInstance.put(`/nurse/${id}`, nurseDto);

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

// Delete a nurse
export const deleteNurse = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/nurse/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`API call failed with status ${error.response?.status}: ${error.response?.statusText}`);
      throw new Error(error.response?.statusText || 'Failed to delete nurse');
    } else {
      console.error('Unknown error occurred during Axios fetch');
      throw new Error('Unknown error occurred during Axios fetch');
    }
  }
};

// Assign rooms to a nurse
export const assignRoomsToNurse = async (nurseId: number, assignmentDto: NurseRoomAssignmentDto): Promise<void> => {
  try {
    await axiosInstance.post(`/nurse/${nurseId}/rooms`, assignmentDto);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`API call failed with status ${error.response?.status}: ${error.response?.statusText}`);
      throw new Error(error.response?.statusText || 'Failed to assign rooms to nurse');
    } else {
      console.error('Unknown error occurred during Axios fetch');
      throw new Error('Unknown error occurred during Axios fetch');
    }
  }
};

// Remove rooms from a nurse
export const removeRoomsFromNurse = async (nurseId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/nurse/${nurseId}/rooms`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`API call failed with status ${error.response?.status}: ${error.response?.statusText}`);
      throw new Error(error.response?.statusText || 'Failed to remove rooms from nurse');
    } else {
      console.error('Unknown error occurred during Axios fetch');
      throw new Error('Unknown error occurred during Axios fetch');
    }
  }
};
const handleError = (error: any) => {
  if (axios.isAxiosError(error)) {
    console.error(`API call failed with status ${error.response?.status}: ${error.response?.statusText}`);
    throw new Error(error.response?.statusText || 'API call failed');
  } else {
    console.error('Unknown error occurred during Axios fetch');
    throw new Error('Unknown error occurred during Axios fetch');
  }
};