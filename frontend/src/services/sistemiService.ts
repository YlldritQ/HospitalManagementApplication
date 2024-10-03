import axios from "axios"; // Import axios for error checking
import axiosInstance from "../utils/axiosInstance"; // Import the centralized Axios instance
import { CUSateliteDto, CUPlanetDto, SateliteDto, PlanetDto } from "../types/sistemiTypes";

export const getPlanets = async (): Promise<PlanetDto[]> => {
  try {
    const response = await axiosInstance.get("/Planet");
    return response.data as PlanetDto[];
  } catch (error) {
    handleError(error);
    return []; // Return an empty array in case of an error
  }
};
export const getSatelites = async (): Promise<SateliteDto[]> => {
  try {
    const response = await axiosInstance.get("/Satelite");
    return response.data as SateliteDto[];
  } catch (error) {
    handleError(error);
    return []; // Return an empty array in case of an error
  }
};

export const getPlanetByID = async (id: number): Promise<PlanetDto | null> => {
  try {
    const response = await axiosInstance.get(`/Planet/${id}`);
    return response.data as PlanetDto;
  } catch (error) {
    handleError(error);
    return null; // Return an empty array in case of an error
  }
};
export const getSateliteByID = async (id: number): Promise<SateliteDto | null> => {
  try {
    const response = await axiosInstance.get(`/Satelite/${id}`);
    return response.data as SateliteDto;
  } catch (error) {
    handleError(error);
    return null; // Return an empty array in case of an error
  }
};

export const createPlanet = async (doctorDto: CUPlanetDto): Promise<PlanetDto> => {
  try {
    const response = await axiosInstance.post("/Planet", doctorDto);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error; // Rethrow the error after logging it
  }
};
export const createSatelite = async (doctorDto: CUSateliteDto): Promise<SateliteDto> => {
  try {
    const response = await axiosInstance.post("/Satelite", doctorDto);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error; // Rethrow the error after logging it
  }
};

export const updatePlanet = async (id: number, doctorDto: CUPlanetDto): Promise<void> => {
      
    try {
        const response = await axiosInstance.put(`/Planet/${id}`, doctorDto);

        return response.data;
      } catch (error) {
        handleError(error);
        throw error; // Rethrow the error after logging it
      }
    
  };
export const updateSatelite = async (id: number, doctorDto: CUSateliteDto): Promise<void> => {
      
  console.log(doctorDto);
    try {
      await axiosInstance.put(`/Satelite/${id}`, doctorDto);

        return;
      } catch (error) {
        console.log(error);
        handleError(error);
        throw error; // Rethrow the error after logging it
      }
    
  };

  export const deletePlanet = async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/Planet/${id}`);
    } catch (error) {
      handleError(error);
      throw error; // Rethrow the error after logging it
    }
  };
  export const deleteSatelite = async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/Satelite/${id}`);
    } catch (error) {
      handleError(error);
      throw error; // Rethrow the error after logging it
    }
  };
  

const handleError = (error: any) => {
  if (axios.isAxiosError(error)) {
    console.error(
      `API call failed with status ${error.response?.status}: ${error.response?.statusText}`
    );
    throw new Error(error.response?.statusText || "API call failed");
  } else {
    console.log(error);
    console.error("Unknown error occurred during Axios fetch");
    throw new Error("Unknown error occurred during Axios fetch");
  }
};
