using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Core.Dtos.General;

namespace backend.Core.Interfaces
{
    public interface IPatientService
    {
        Task<PatientDto> GetPatientByIdAsync(int patientId);
        Task<IEnumerable<PatientDto>> GetAllPatientsAsync();
        Task<PatientDto> CreatePatientAsync(PatientDto patientDto);
        Task UpdatePatientAsync(int patientId, PatientDto patientDto);
        Task DeletePatientAsync(int patientId);
    }
}
