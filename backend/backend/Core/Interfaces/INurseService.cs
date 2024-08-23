using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Core.Dtos.General;

public interface INurseService
{
    Task<NurseDto> GetNurseByIdAsync(int nurseId);
    Task<IEnumerable<NurseDto>> GetAllNursesAsync();
    Task CreateNurseAsync(NurseDto nurseDto);
    Task UpdateNurseAsync(int nurseId, NurseDto nurseDto);
    Task DeleteNurseAsync(int nurseId);
}
