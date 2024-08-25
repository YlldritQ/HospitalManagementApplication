using backend.Core.DbContext;
using backend.Core.Dtos.General;
using backend.Core.Entities;
using Microsoft.EntityFrameworkCore;

public class RoomService : IRoomService
{
    private readonly ApplicationDbContext _context;

    public RoomService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<RoomDto> GetRoomByIdAsync(int roomId)
    {
        var room = await _context.Rooms.FindAsync(roomId);
        if (room == null) return null;

        return new RoomDto
        {
            Id = room.Id,
            RoomNumber = room.RoomNumber,
            RoomType = room.RoomType,
            IsOccupied = room.IsOccupied,
            PatientId = room.PatientId
        };
    }

    public async Task<IEnumerable<RoomDto>> GetAllRoomsAsync()
    {
        return await _context.Rooms
            .Select(room => new RoomDto
            {
                Id = room.Id,
                RoomNumber = room.RoomNumber,
                RoomType = room.RoomType,
                IsOccupied = room.IsOccupied,
                PatientId = room.PatientId
            })
            .ToListAsync();
    }

    public async Task CreateRoomAsync(RoomDto roomDto)
    {
        var room = new Room
        {
            RoomNumber = roomDto.RoomNumber,
            RoomType = roomDto.RoomType,
            IsOccupied = roomDto.IsOccupied,
            PatientId = roomDto.PatientId
        };

        await _context.Rooms.AddAsync(room);
        await _context.SaveChangesAsync();

        roomDto.Id = room.Id;
    }

    public async Task UpdateRoomAsync(int roomId, RoomDto roomDto)
    {
        var room = await _context.Rooms.FindAsync(roomId);
        if (room == null) return;

        room.RoomNumber = roomDto.RoomNumber;
        room.RoomType = roomDto.RoomType;
        room.IsOccupied = roomDto.IsOccupied;
        room.PatientId = roomDto.PatientId;

        await _context.SaveChangesAsync();
    }

    public async Task DeleteRoomAsync(int roomId)
    {
        var room = await _context.Rooms.FindAsync(roomId);
        if (room == null) return;

        _context.Rooms.Remove(room);
        await _context.SaveChangesAsync();
    }
}
