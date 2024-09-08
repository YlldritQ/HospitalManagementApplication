// RoomDto.ts
export interface RoomDto {
    id: number;
    roomNumber: string;
    isOccupied: boolean;
    departmentId: number;
}

// CURoomDto.ts
export interface CURoomDto {
    roomNumber: string;
    isOccupied: boolean;
    departmentId: number;
}
