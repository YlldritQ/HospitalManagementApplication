using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Core.Dtos.General;
using backend.Core.Dtos.Patient;

namespace backend.Core.Interfaces
{
    public interface IPatientService
    {
        Task<PatientDto> GetPatientByIdAsync(int patientId);
        Task<IEnumerable<PatientDto>> GetAllPatientsAsync();
        Task<GeneralServiceResponseDto> CreatePatientAsync(CUPatientDto patientDto);
        Task<GeneralServiceResponseDto> UpdatePatientAsync(int patientId, CUPatientDto patientDto);
        Task DeletePatientAsync(int patientId);
    }
}
