using AutoMapper;
using backend.Core.DbContext;
using backend.Core.Dtos.Doctor;
using backend.Core.Dtos.General;
using backend.Core.Dtos.Nurse;
using backend.Core.Dtos.Room;
using backend.Core.Entities;
using Microsoft.EntityFrameworkCore;

public class DoctorService : IDoctorService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public DoctorService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<DoctorDto> GetDoctorByIdAsync(int doctorId)
    {
        var doctor = await _context.Doctors
            .AsNoTracking()
            .Include(d => d.DoctorRooms)
                .ThenInclude(dr => dr.Room)
            .Include(d => d.Department)
            .FirstOrDefaultAsync(d => d.Id == doctorId);

        if (doctor == null) return null;

        return _mapper.Map<DoctorDto>(doctor);
    }

    public async Task<DoctorDto> GetDoctorByUserIdAsync(string userId)
    {
        var doc = await _context.Doctors
            .AsNoTracking()
            .Include(n => n.DoctorRooms)  // You may still include this for internal use
                .ThenInclude(nr => nr.Room)
            .Include(n => n.Department)
            .FirstOrDefaultAsync(n => n.UserId == userId);

        if (doc == null) return null;

        return _mapper.Map<DoctorDto>(doc);
    }
    public async Task<IEnumerable<DoctorDto>> GetAllDoctorsAsync()
    {
        var doctors = await _context.Doctors
            .AsNoTracking()
            .Include(d => d.DoctorRooms)
                .ThenInclude(dr => dr.Room)
            .Include(d => d.Department)
            .ToListAsync();

        return _mapper.Map<IEnumerable<DoctorDto>>(doctors);
    }

    //get doctors by department id
    public async Task<IEnumerable<DoctorDto>> GetDoctorsByDepartmentIdAsync(int departmentId)
    {
        var doctors = await _context.Doctors
            .AsNoTracking()
            .Where(d => d.DepartmentId == departmentId)
            .ToListAsync();

        return _mapper.Map<IEnumerable<DoctorDto>>(doctors);
    }

    //get doctors with no departament
    public async Task<IEnumerable<DoctorDto>> GetDoctorsWithNoDepartmentAsync()
    {
        // Fetch doctors where DepartmentId is null or unassigned
        var doctorsWithNoDepartment = await _context.Doctors
            .AsNoTracking()
            .Where(d => d.DepartmentId == null)
            .ToListAsync();

        return _mapper.Map<IEnumerable<DoctorDto>>(doctorsWithNoDepartment);
    }

    public async Task<GeneralServiceResponseDto> CreateDoctorAsync(CUDoctorDto doctorDto)
    {

        // Ensure the department exists
        var department = await _context.Departments.FindAsync(doctorDto.DepartmentId);
        if (department == null)
        {
            return new GeneralServiceResponseDto() {
                IsSucceed = false ,
                StatusCode = 400,
                Message = " Given Department Doesn't exist"};
        }

        if(doctorDto.DateHired > DateTime.UtcNow)
        {
            return new GeneralServiceResponseDto()
            {
                IsSucceed = false,
                StatusCode = 400,
                Message = "Date Hired cannot be in the future"
            };
        }
        if (doctorDto.DateOfBirth > DateTime.UtcNow.AddYears(-18))
        {
            return new GeneralServiceResponseDto()
            {
                IsSucceed = false,
                StatusCode = 400,
                Message = "Cannot be younger than 18"
            };
        }


        var doctor = _mapper.Map<Doctor>(doctorDto);
        doctor.Department = department;

        // Save the doctor entity first
        await _context.Doctors.AddAsync(doctor);
        await _context.SaveChangesAsync();
        return new GeneralServiceResponseDto()
        {
            IsSucceed = true,
            StatusCode = 201,
            Message = " Success"
        };

    }

    public async Task<GeneralServiceResponseDto> UpdateDoctorAsync(int doctorId, CUDoctorDto doctorDto)
    {
        var response = new GeneralServiceResponseDto();

        var doctor = await _context.Doctors
            .Include(d => d.DoctorRooms)
            .FirstOrDefaultAsync(d => d.Id == doctorId);

        if (doctor == null)
        {
            response.IsSucceed = false;
            response.StatusCode = 404; // Not Found
            response.Message = $"Doctor with ID {doctorId} not found.";
            return response;
        }

        // Ensure the department exists
        var department = await _context.Departments.FindAsync(doctorDto.DepartmentId);
        if (department == null)
        {
            response.IsSucceed = false;
            response.StatusCode = 404; // Not Found
            response.Message = $"Department with ID {doctorDto.DepartmentId} not found.";
            return response;
        }

        try
        {
            // Map the incoming DTO to the doctor entity
            _mapper.Map(doctorDto, doctor);
            doctor.Department = department;

            // Save changes to the database
            await _context.SaveChangesAsync();

            response.IsSucceed = true;
            response.StatusCode = 200; // OK
            response.Message = "Doctor updated successfully.";
            return response;
        }
        catch (Exception ex)
        {
            response.IsSucceed = false;
            response.StatusCode = 500; // Internal Server Error
            response.Message = $"An error occurred while updating the doctor: {ex.Message}";
            return response;
        }
    }


    public async Task DeleteDoctorAsync(int doctorId)
    {
        var doctor = await _context.Doctors
            .Include(d => d.DoctorRooms)
            .FirstOrDefaultAsync(d => d.Id == doctorId);

        if (doctor == null)
        {
            throw new ArgumentException($"Doctor with ID {doctorId} not found.");
        }

        // Remove the doctor-rooms relationships first
        _context.DoctorRooms.RemoveRange(doctor.DoctorRooms);

        _context.Doctors.Remove(doctor);
        await _context.SaveChangesAsync();
    }

    // Methods to Manage Room Assignments

    public async Task AssignRoomsToDoctorAsync(DoctorRoomManagementDto doctorRoomDto)
    {
        var doctor = await _context.Doctors
            .Include(d => d.DoctorRooms)
            .FirstOrDefaultAsync(d => d.Id == doctorRoomDto.DoctorId);

        if (doctor == null)
        {
            throw new ArgumentException($"Doctor with ID {doctorRoomDto.DoctorId} not found.");
        }

        var rooms = await _context.Rooms.Where(r => doctorRoomDto.RoomIds.Contains(r.Id)).ToListAsync();
        if (rooms.Count != doctorRoomDto.RoomIds.Count)
        {
            throw new ArgumentException("Some rooms could not be found.");
        }


        // Add new room assignments
        var doctorRooms = doctorRoomDto.RoomIds.Select(roomId => new DoctorRoom
        {
            DoctorId = doctor.Id,
            RoomId = roomId
        }).ToList();

        await _context.DoctorRooms.AddRangeAsync(doctorRooms);
        await _context.SaveChangesAsync();
    }

    public async Task RemoveRoomsFromDoctorAsync(DoctorRoomManagementDto doctorRoomDto)
    {
        var doctorRoomsToRemove = await _context.DoctorRooms
            .Where(dr => dr.DoctorId == doctorRoomDto.DoctorId && doctorRoomDto.RoomIds.Contains(dr.RoomId))
            .ToListAsync();

        _context.DoctorRooms.RemoveRange(doctorRoomsToRemove);
        await _context.SaveChangesAsync();
    }
    public async Task<IEnumerable<RoomDto>> GetRoomsAssignedToDoctorAsync(int doctorId)
    {
        var rooms = await _context.DoctorRooms
            .Where(dr => dr.DoctorId == doctorId)
            .Include(dr => dr.Room)
            .Select(dr => dr.Room)
            .ToListAsync();

        return _mapper.Map<IEnumerable<RoomDto>>(rooms);
    }
}
