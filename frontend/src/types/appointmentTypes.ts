// appointmentTypes.ts

export interface AppointmentDto {
    id: number;
    appointmentDate: Date;
    patientId: number;
    doctorId: number;
    status: string;
    roomId: number;
  }
  
  export interface CUAppointmentDto {
    appointmentDate: Date;
    patientId: number;
    doctorId: number;
    status: string;
    roomId: number;
  }
  