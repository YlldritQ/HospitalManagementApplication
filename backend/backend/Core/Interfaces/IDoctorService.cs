﻿using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Core.Dtos.Doctor;
using backend.Core.Dtos.General;

public interface IDoctorService
{
    Task<DoctorDto> GetDoctorByIdAsync(int doctorId);
    Task<IEnumerable<DoctorDto>> GetAllDoctorsAsync();
    Task<GeneralServiceResponseDto> CreateDoctorAsync(CUDoctorDto doctorDto);
    Task UpdateDoctorAsync(int doctorId, CUDoctorDto doctorDto);
    Task DeleteDoctorAsync(int doctorId);
    Task AssignRoomsToDoctorAsync(DoctorRoomManagementDto doctorRoomDto);
    Task RemoveRoomsFromDoctorAsync(DoctorRoomManagementDto doctorRoomDto);
}
