
import axios from 'axios';

const PATIENTS_API_URL = "/api/patient"; 

export const getPatients = async () => {
  const response = await axios.get(PATIENTS_API_URL);
  return response.data;
};
