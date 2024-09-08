using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Core.Dtos.General;
using backend.Core.Dtos.Staff;

public interface IMedicalStaffService
{
    Task<MedicalStaffDto> GetMedicalStaffByIdAsync(int staffId);
    Task<IEnumerable<MedicalStaffDto>> GetAllMedicalStaffAsync();
    Task<GeneralServiceResponseDto> UpdateMedicalStaffAsync(int staffId, MedicalStaffDto staffDto);
}
