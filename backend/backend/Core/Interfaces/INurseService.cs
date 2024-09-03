using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Core.Dtos.General;
using backend.Core.Dtos.Nurse;

public interface INurseService
{
    Task<NurseDto> GetNurseByIdAsync(int nurseId);
    Task<IEnumerable<NurseDto>> GetAllNursesAsync();
    Task<GeneralServiceResponseDto> CreateNurseAsync(CUNurseDto nurseDto);
    Task UpdateNurseAsync(int nurseId, CUNurseDto nurseDto);
    Task DeleteNurseAsync(int nurseId);
    Task AssignRoomsToNurseAsync(NurseRoomAssignmentDto assignmentDto);
    Task RemoveRoomsFromNurseAsync(int nurseId);
}
