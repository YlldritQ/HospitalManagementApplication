using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Core.Dtos.General;

public interface IPrescriptionService
{
    Task<PrescriptionDto> GetPrescriptionByIdAsync(int prescriptionId);
    Task<IEnumerable<PrescriptionDto>> GetAllPrescriptionsAsync();
    Task CreatePrescriptionAsync(PrescriptionDto prescriptionDto);
    Task UpdatePrescriptionAsync(int prescriptionId, PrescriptionDto prescriptionDto);
    Task DeletePrescriptionAsync(int prescriptionId);
}
