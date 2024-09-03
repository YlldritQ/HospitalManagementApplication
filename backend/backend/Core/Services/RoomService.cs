using AutoMapper;
using backend.Core.DbContext;
using backend.Core.Dtos.General;
using backend.Core.Entities;
using Microsoft.EntityFrameworkCore;

public class RoomService : IRoomService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public RoomService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<RoomDto> GetRoomByIdAsync(int roomId)
    {
        var room = await _context.Rooms
            .AsNoTracking()
            .Include(r => r.Department)
            .FirstOrDefaultAsync(r => r.Id == roomId);

        if (room == null) return null;

        return _mapper.Map<RoomDto>(room);
    }

    public async Task<IEnumerable<RoomDto>> GetAllRoomsAsync()
    {
        var rooms = await _context.Rooms
            .AsNoTracking()
            .Include(r => r.Department)
            .ToListAsync();

        return _mapper.Map<IEnumerable<RoomDto>>(rooms);
    }

    public async Task CreateRoomAsync(RoomDto roomDto)
    {
        var room = _mapper.Map<Room>(roomDto);

        // Validate Department
        var department = await _context.Departments.FindAsync(roomDto.DepartmentId);
        if (department == null)
        {
            throw new ArgumentException($"Department with ID {roomDto.DepartmentId} not found.");
        }

        room.Department = department;

        await _context.Rooms.AddAsync(room);
        await _context.SaveChangesAsync();

        roomDto.Id = room.Id; // Update the DTO with the generated ID
    }

    public async Task UpdateRoomAsync(int roomId, RoomDto roomDto)
    {
        var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Id == roomId);

        if (room == null)
        {
            throw new ArgumentException($"Room with ID {roomId} not found.");
        }

        // Validate Department
        var department = await _context.Departments.FindAsync(roomDto.DepartmentId);
        if (department == null)
        {
            throw new ArgumentException($"Department with ID {roomDto.DepartmentId} not found.");
        }

        room.RoomNumber = roomDto.RoomNumber;
        room.IsOccupied = roomDto.IsOccupied;
        room.DepartmentId = roomDto.DepartmentId;
        room.Department = department;

        _context.Rooms.Update(room);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteRoomAsync(int roomId)
    {
        var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Id == roomId);

        if (room == null)
        {
            throw new ArgumentException($"Room with ID {roomId} not found.");
        }

        _context.Rooms.Remove(room);
        await _context.SaveChangesAsync();
    }
}
