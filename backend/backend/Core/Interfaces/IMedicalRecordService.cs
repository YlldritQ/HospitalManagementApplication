using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Core.Dtos.General;

public interface IMedicalRecordService
{
    Task<MedicalRecordDto> GetMedicalRecordByIdAsync(int recordId);
    Task<IEnumerable<MedicalRecordDto>> GetAllMedicalRecordsAsync();
    Task CreateMedicalRecordAsync(MedicalRecordDto recordDto);
    Task UpdateMedicalRecordAsync(int recordId, MedicalRecordDto recordDto);
    Task DeleteMedicalRecordAsync(int recordId);
}
