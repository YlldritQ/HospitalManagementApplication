import axios from 'axios'; // Import axios for error checking
import axiosInstance from "../utils/axiosInstance"; // Adjust the import path as needed

export const getDoctors = async () => {
  try {
    const response = await axiosInstance.get('/Doctor');

    // Axios automatically handles JSON parsing
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
