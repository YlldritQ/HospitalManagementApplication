import axiosInstance from '../utils/axiosInstance'; // Import the configured Axios instance
import { RoomDto , CURoomDto } from '../types/roomTypes'; // Import RoomDto interface
import { GeneralServiceResponseDto } from '../types/generalTypes'; // Import response DTOs
import axios from 'axios';

// Get all rooms
export const getAllRooms = async (): Promise<RoomDto[]> => {
    try {
        const response = await axiosInstance.get('/room');
        return response.data as RoomDto[];
    } catch (error) {
        handleError(error);
        return []; // Return an empty array in case of an error
    }
};

// Get room by ID
export const getRoomById = async (id: number): Promise<RoomDto | null> => {
    try {
        const response = await axiosInstance.get(`/room/${id}`);
        return response.data as RoomDto;
    } catch (error) {
        handleError(error);
        return null; // Return null in case of an error
    }
};

// Create a new room
export const createRoom = async (roomDto: CURoomDto): Promise<RoomDto> => {
    try {
        const response = await axiosInstance.post('/room', roomDto);
        return response.data as RoomDto;
    } catch (error) {
        handleError(error);
        throw error; // Rethrow the error after logging it
    }
};

// Update an existing room
export const updateRoom = async (id: number, roomDto: CURoomDto): Promise<GeneralServiceResponseDto> => {
    try {
        const response = await axiosInstance.put(`/room/${id}`, roomDto);
        return response.data as GeneralServiceResponseDto;
    } catch (error) {
        handleError(error);
        throw error; // Rethrow the error after logging it
    }
};

export const getUnassignedRoomsForDoctors = async (): Promise<RoomDto[]> => {
    try {
        const response = await axiosInstance.get('/room/unassignedDocs');
        return response.data as RoomDto[];
    } catch (error) {
        handleError(error);
        return []; // Return an empty array in case of an error
    }
};

export const getUnassignedRoomsForNurses = async (): Promise<RoomDto[]> => {
    try {
        const response = await axiosInstance.get('/room/unassignedNurse');
        return response.data as RoomDto[];
    } catch (error) {
        handleError(error);
        return []; // Return an empty array in case of an error
    }
};


// Delete a room
export const deleteRoom = async (id: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/room/${id}`);
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
