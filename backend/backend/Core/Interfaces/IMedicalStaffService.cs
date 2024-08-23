using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Core.Dtos.General;

public interface IMedicalStaffService
{
    Task<MedicalStaffDto> GetMedicalStaffByIdAsync(int staffId);
    Task<IEnumerable<MedicalStaffDto>> GetAllMedicalStaffAsync();
    Task UpdateMedicalStaffAsync(int staffId, MedicalStaffDto staffDto);
}
