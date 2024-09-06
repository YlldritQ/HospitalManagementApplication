
import axiosInstance from "../utils/axiosInstance";
import axios from 'axios';

export const getNurses = async () => {
  try {
    const response = await axiosInstance.get('/Nurse');
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
