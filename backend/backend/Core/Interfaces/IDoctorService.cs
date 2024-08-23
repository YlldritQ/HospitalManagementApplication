using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Core.Dtos.General;

public interface IDoctorService
{
    Task<DoctorDto> GetDoctorByIdAsync(int doctorId);
    Task<IEnumerable<DoctorDto>> GetAllDoctorsAsync();
    Task CreateDoctorAsync(DoctorDto doctorDto);
    Task UpdateDoctorAsync(int doctorId, DoctorDto doctorDto);
    Task DeleteDoctorAsync(int doctorId);
}
