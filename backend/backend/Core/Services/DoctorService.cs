using AutoMapper;
using backend.Core.DbContext;
using backend.Core.Dtos.Doctor;
using backend.Core.Dtos.General;
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

    public async Task<GeneralServiceResponseDto> CreateDoctorAsync(CUDoctorDto doctorDto)
    {
        var doctor = _mapper.Map<Doctor>(doctorDto);

        // Ensure the department exists
        var department = await _context.Departments.FindAsync(doctorDto.DepartmentId);
        if (department == null)
        {
            return new GeneralServiceResponseDto() {
                IsSucceed = false ,
                StatusCode = 400,
                Message = " Given Department Doesn't exist"};
        }

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

    public async Task UpdateDoctorAsync(int doctorId, CUDoctorDto doctorDto)
    {
        var doctor = await _context.Doctors
            .Include(d => d.DoctorRooms)
            .FirstOrDefaultAsync(d => d.Id == doctorId);

        if (doctor == null)
        {
            throw new ArgumentException($"Doctor with ID {doctorId} not found.");
        }

        _mapper.Map(doctorDto, doctor);

        // Ensure the department exists
        var department = await _context.Departments.FindAsync(doctorDto.DepartmentId);
        if (department == null)
        {
            throw new ArgumentException($"Department with ID {doctorDto.DepartmentId} not found.");
        }

        doctor.Department = department;

        await _context.SaveChangesAsync();
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

        // Remove existing room assignments
        _context.DoctorRooms.RemoveRange(doctor.DoctorRooms);

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
}
