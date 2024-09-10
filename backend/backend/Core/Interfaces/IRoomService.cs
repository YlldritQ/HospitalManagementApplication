using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Core.Dtos.General;
using backend.Core.Dtos.Room;

public interface IRoomService
{
    Task<RoomDto> GetRoomByIdAsync(int roomId);
    Task<IEnumerable<RoomDto>> GetAllRoomsAsync();
    Task<GeneralServiceResponseDto> CreateRoomAsync(CURoomDto roomDto);
    Task<IEnumerable<RoomDto>> GetUnassignedRoomsToDoctorsAsync();
    Task<IEnumerable<RoomDto>> GetRoomsWithNoDepartmentAsync();

    Task<IEnumerable<RoomDto>> GetRoomsByDepartmentIdAsync(int departmentId);

    Task<IEnumerable<RoomDto>> GetUnassignedRoomsToNursesAsync();
    Task<GeneralServiceResponseDto> UpdateRoomAsync(int roomId, CURoomDto roomDto);
    Task DeleteRoomAsync(int roomId);
}
