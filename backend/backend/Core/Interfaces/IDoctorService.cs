using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Core.Dtos.Doctor;
using backend.Core.Dtos.General;
using backend.Core.Dtos.Room;

public interface IDoctorService
{
    Task<DoctorDto> GetDoctorByIdAsync(int doctorId);
    Task<IEnumerable<DoctorDto>> GetAllDoctorsAsync();
    Task<IEnumerable<DoctorDto>> GetDoctorsByDepartmentIdAsync(int departmentId);
    Task<IEnumerable<DoctorDto>> GetDoctorsWithNoDepartmentAsync();

    Task<GeneralServiceResponseDto> CreateDoctorAsync(CUDoctorDto doctorDto);
    Task<GeneralServiceResponseDto> UpdateDoctorAsync(int doctorId, CUDoctorDto doctorDto);

    Task DeleteDoctorAsync(int doctorId);
    Task AssignRoomsToDoctorAsync(DoctorRoomManagementDto doctorRoomDto);
    Task RemoveRoomsFromDoctorAsync(DoctorRoomManagementDto doctorRoomDto);
    Task<IEnumerable<RoomDto>> GetRoomsAssignedToDoctorAsync(int doctorId);
}
