// types.ts

export interface NurseDto {
    id: number;
    firstName: string;
    lastName: string;
    gender: string;
    contactInfo: string;
    dateOfBirth: Date;
    dateHired: Date;
    qualifications: string;
    isAvailable: boolean;
    departmentId: number;
    userId: string;
    // Optional: if NurseRoomDto is used, define it and include it here
    // nurseRooms?: NurseRoomDto[];
}

export interface CUNurseDto {
    firstName: string;
    lastName: string;
    gender: string;
    contactInfo: string;
    dateOfBirth: Date;
    dateHired: Date;
    qualifications: string;
    isAvailable: boolean;
    departmentId: number;
    userId: string;
}

export interface NurseRoomAssignmentDto {
    nurseId: number;
    roomIds: number[];
}
