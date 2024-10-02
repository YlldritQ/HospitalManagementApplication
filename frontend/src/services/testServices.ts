import axios from "axios"; // Import axios for error checking
import axiosInstance from "../utils/axiosInstance"; // Import the centralized Axios instance
import { CUPlayerDto, CUTeamDto, PlayerDto, TeamDto } from "../types/testTypes";

export const getTeams = async (): Promise<TeamDto[]> => {
  try {
    const response = await axiosInstance.get("/Team");
    return response.data as TeamDto[];
  } catch (error) {
    handleError(error);
    return []; // Return an empty array in case of an error
  }
};
export const getPlayers = async (): Promise<PlayerDto[]> => {
  try {
    const response = await axiosInstance.get("/Player");
    return response.data as PlayerDto[];
  } catch (error) {
    handleError(error);
    return []; // Return an empty array in case of an error
  }
};

export const getTeamByID = async (id: number): Promise<TeamDto | null> => {
  try {
    const response = await axiosInstance.get(`/Team/${id}`);
    return response.data as TeamDto;
  } catch (error) {
    handleError(error);
    return null; // Return an empty array in case of an error
  }
};
export const getPlayerByID = async (id: number): Promise<PlayerDto | null> => {
  try {
    const response = await axiosInstance.get(`/Player/${id}`);
    return response.data as PlayerDto;
  } catch (error) {
    handleError(error);
    return null; // Return an empty array in case of an error
  }
};

export const createTeam = async (doctorDto: CUTeamDto): Promise<TeamDto> => {
  try {
    const response = await axiosInstance.post("/Team", doctorDto);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error; // Rethrow the error after logging it
  }
};
export const createPlayer = async (doctorDto: CUPlayerDto): Promise<PlayerDto> => {
  try {
    const response = await axiosInstance.post("/Player", doctorDto);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error; // Rethrow the error after logging it
  }
};

export const updateTeam = async (id: number, doctorDto: CUTeamDto): Promise<void> => {
      
    try {
        const response = await axiosInstance.put(`/Team/${id}`, doctorDto);

        return response.data;
      } catch (error) {
        handleError(error);
        throw error; // Rethrow the error after logging it
      }
    
  };
export const updatePlayer = async (id: number, doctorDto: CUPlayerDto): Promise<void> => {
      
  console.log(doctorDto);
    try {
      await axiosInstance.put(`/Player/${id}`, doctorDto);

        return;
      } catch (error) {
        console.log(error);
        handleError(error);
        throw error; // Rethrow the error after logging it
      }
    
  };

  export const deleteTeam = async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/Team/${id}`);
    } catch (error) {
      handleError(error);
      throw error; // Rethrow the error after logging it
    }
  };
  export const deletePlayer = async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/Player/${id}`);
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
