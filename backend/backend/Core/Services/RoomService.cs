using AutoMapper;
using backend.Core.DbContext;
using backend.Core.Dtos.General;
using backend.Core.Dtos.Room;
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

    public async Task<IEnumerable<RoomDto>> GetUnassignedRoomsToDoctorsAsync()
    {
        // Fetch rooms that are not linked to any doctor in the DoctorRooms table
        var unassignedRooms = await _context.Rooms
            .AsNoTracking()
            .Include(r => r.Department)
            .Where(r => !_context.DoctorRooms.Any(dr => dr.RoomId == r.Id))
            .ToListAsync();

        return _mapper.Map<IEnumerable<RoomDto>>(unassignedRooms);
    }

    public async Task<IEnumerable<RoomDto>> GetUnassignedRoomsToNursesAsync()
    {
        // Fetch rooms that are not linked to any nurse in the NurseRooms table
        var unassignedRooms = await _context.Rooms
            .AsNoTracking()
            .Include(r => r.Department)
            .Where(r => !_context.NurseRooms.Any(nr => nr.RoomId == r.Id))
            .ToListAsync();

        return _mapper.Map<IEnumerable<RoomDto>>(unassignedRooms);
    }


    public async Task<GeneralServiceResponseDto> CreateRoomAsync(CURoomDto roomDto)
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

        return new GeneralServiceResponseDto()
        {
            IsSucceed = true,
            StatusCode = 200,
            Message = "Room Inserted"
        };
    }
    public async Task<GeneralServiceResponseDto> UpdateRoomAsync(int roomId, CURoomDto roomDto)
    {
        try
        {
            // Fetch the existing room
            var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Id == roomId);

            if (room == null)
            {
                return new GeneralServiceResponseDto
                {
                    IsSucceed = false,
                    StatusCode = 404,
                    Message = $"Room with ID {roomId} not found."
                };
            }

            // Validate the department exists
            var department = await _context.Departments.FindAsync(roomDto.DepartmentId);
            if (department == null)
            {
                return new GeneralServiceResponseDto
                {
                    IsSucceed = false,
                    StatusCode = 404,
                    Message = $"Department with ID {roomDto.DepartmentId} not found."
                };
            }

            // Update the room details
            room.RoomNumber = roomDto.RoomNumber;
            room.IsOccupied = roomDto.IsOccupied;
            room.DepartmentId = roomDto.DepartmentId;
            room.Department = department;

            // Update the room in the database
            _context.Rooms.Update(room);
            await _context.SaveChangesAsync();

            // Return a success response
            return new GeneralServiceResponseDto
            {
                IsSucceed = true,
                StatusCode = 200,
                Message = $"Room with ID {roomId} has been updated successfully."
            };
        }
        catch (DbUpdateException)
        {
            // Handle database update exceptions
            return new GeneralServiceResponseDto
            {
                IsSucceed = false,
                StatusCode = 500,
                Message = "An error occurred while updating the room."
            };
        }
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
