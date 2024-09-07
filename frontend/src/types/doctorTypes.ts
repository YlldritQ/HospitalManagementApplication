// Define interfaces for DTOs

export interface DoctorDto {
    id: number;
    firstName: string;
    lastName: string;
    gender: string;
    contactInfo: string;
    dateOfBirth: Date;
    dateHired: Date;
    specialty: string;
    qualifications: string;
    isAvailable: boolean;
    departmentId: number;
    userId: string;
  }
  
  export interface CUDoctorDto {
    firstName: string;
    lastName: string;
    gender: string;
    contactInfo: string;
    dateOfBirth: Date;
    dateHired: Date;
    specialty: string;
    qualifications: string;
    isAvailable: boolean;
    departmentId: number;
    userId: string;
  }
  
  export interface DoctorRoomManagementDto {
    doctorId: number;
    roomIds: number[];
  }
  