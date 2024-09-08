using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Core.Dtos.General;
using backend.Core.Dtos.Records;

public interface IMedicalRecordService
{
    Task<MedicalRecordDto> GetMedicalRecordByIdAsync(int recordId);
    Task<IEnumerable<MedicalRecordDto>> GetAllMedicalRecordsAsync();
    Task<GeneralServiceResponseDto> CreateMedicalRecordAsync(CUMedicalRecordDto recordDto);
    Task<GeneralServiceResponseDto> UpdateMedicalRecordAsync(int recordId, CUMedicalRecordDto recordDto);
    Task DeleteMedicalRecordAsync(int recordId);
}
