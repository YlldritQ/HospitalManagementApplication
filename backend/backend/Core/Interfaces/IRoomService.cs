using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Core.Dtos.General;

public interface IRoomService
{
    Task<RoomDto> GetRoomByIdAsync(int roomId);
    Task<IEnumerable<RoomDto>> GetAllRoomsAsync();
    Task CreateRoomAsync(RoomDto roomDto);
    Task UpdateRoomAsync(int roomId, RoomDto roomDto);
    Task DeleteRoomAsync(int roomId);
}
