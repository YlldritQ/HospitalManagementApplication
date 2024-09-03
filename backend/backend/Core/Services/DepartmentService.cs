using AutoMapper;
using backend.Core.DbContext;
using backend.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class DepartmentService : IDepartmentService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public DepartmentService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<DepartmentDto> GetDepartmentByIdAsync(int departmentId)
    {
        var department = await _context.Departments
            .AsNoTracking()
            .Include(d => d.Doctors)
            .Include(d => d.Nurses)
            .Include(d => d.Rooms)
            .FirstOrDefaultAsync(d => d.Id == departmentId);

        if (department == null)
        {
            throw new ArgumentException($"Department with ID {departmentId} not found.");
        }

        return _mapper.Map<DepartmentDto>(department);
    }

    public async Task<IEnumerable<DepartmentDto>> GetAllDepartmentsAsync()
    {
        var departments = await _context.Departments
            .AsNoTracking()
            .ToListAsync();

        return _mapper.Map<IEnumerable<DepartmentDto>>(departments);
    }

    public async Task CreateDepartmentAsync(DepartmentDto departmentDto)
    {
        ValidateDepartmentDto(departmentDto);

        var department = _mapper.Map<Department>(departmentDto);

        await _context.Departments.AddAsync(department);
        await _context.SaveChangesAsync();

        departmentDto.Id = department.Id;
    }

    public async Task UpdateDepartmentAsync(int departmentId, DepartmentDto departmentDto)
    {
        var department = await _context.Departments
            .FirstOrDefaultAsync(d => d.Id == departmentId);

        if (department == null)
        {
            throw new ArgumentException($"Department with ID {departmentId} not found.");
        }

        ValidateDepartmentDto(departmentDto);

        _mapper.Map(departmentDto, department);

        await _context.SaveChangesAsync();
    }

    public async Task DeleteDepartmentAsync(int departmentId)
    {
        var department = await _context.Departments
            .Include(d => d.Doctors)
            .Include(d => d.Nurses)
            .Include(d => d.Rooms)
            .FirstOrDefaultAsync(d => d.Id == departmentId);

        if (department == null)
        {
            throw new ArgumentException($"Department with ID {departmentId} not found.");
        }

        // Detach related entities before deletion
        if (department.Doctors.Any())
        {
            foreach (var doctor in department.Doctors)
            {
                doctor.DepartmentId = null; // Assuming nullable foreign key
            }
        }

        if (department.Nurses.Any())
        {
            foreach (var nurse in department.Nurses)
            {
                nurse.DepartmentId = null; // Assuming nullable foreign key
            }
        }

        if (department.Rooms.Any())
        {
            foreach (var room in department.Rooms)
            {
                room.DepartmentId = null; // Assuming nullable foreign key
            }
        }

        _context.Departments.Remove(department);
        await _context.SaveChangesAsync();
    }

    // Separate Methods to Handle Related Entities

    public async Task AddDoctorsToDepartmentAsync(int departmentId, IEnumerable<int> doctorIds)
    {
        var department = await _context.Departments.FindAsync(departmentId);
        if (department == null) throw new ArgumentException($"Department with ID {departmentId} not found.");

        var doctors = await _context.Doctors.Where(d => doctorIds.Contains(d.Id)).ToListAsync();
        if (doctors.Count != doctorIds.Count())
        {
            throw new ArgumentException("Some doctors could not be found.");
        }

        foreach (var doctor in doctors)
        {
            doctor.DepartmentId = departmentId;
        }

        await _context.SaveChangesAsync();
    }

    public async Task RemoveDoctorsFromDepartmentAsync(int departmentId, IEnumerable<int> doctorIds)
    {
        var doctors = await _context.Doctors.Where(d => doctorIds.Contains(d.Id) && d.DepartmentId == departmentId).ToListAsync();
        foreach (var doctor in doctors)
        {
            doctor.DepartmentId = null; // Assuming nullable foreign key
        }

        await _context.SaveChangesAsync();
    }

    public async Task AddNursesToDepartmentAsync(int departmentId, IEnumerable<int> nurseIds)
    {
        var department = await _context.Departments.FindAsync(departmentId);
        if (department == null) throw new ArgumentException($"Department with ID {departmentId} not found.");

        var nurses = await _context.Nurses.Where(n => nurseIds.Contains(n.Id)).ToListAsync();
        if (nurses.Count != nurseIds.Count())
        {
            throw new ArgumentException("Some nurses could not be found.");
        }

        foreach (var nurse in nurses)
        {
            nurse.DepartmentId = departmentId;
        }

        await _context.SaveChangesAsync();
    }

    public async Task RemoveNursesFromDepartmentAsync(int departmentId, IEnumerable<int> nurseIds)
    {
        var nurses = await _context.Nurses.Where(n => nurseIds.Contains(n.Id) && n.DepartmentId == departmentId).ToListAsync();
        foreach (var nurse in nurses)
        {
            nurse.DepartmentId = null; // Assuming nullable foreign key
        }

        await _context.SaveChangesAsync();
    }

    public async Task AddRoomsToDepartmentAsync(int departmentId, IEnumerable<int> roomIds)
    {
        var department = await _context.Departments.FindAsync(departmentId);
        if (department == null) throw new ArgumentException($"Department with ID {departmentId} not found.");

        var rooms = await _context.Rooms.Where(r => roomIds.Contains(r.Id)).ToListAsync();
        if (rooms.Count != roomIds.Count())
        {
            throw new ArgumentException("Some rooms could not be found.");
        }

        foreach (var room in rooms)
        {
            room.DepartmentId = departmentId;
        }

        await _context.SaveChangesAsync();
    }

    public async Task RemoveRoomsFromDepartmentAsync(int departmentId, IEnumerable<int> roomIds)
    {
        var rooms = await _context.Rooms.Where(r => roomIds.Contains(r.Id) && r.DepartmentId == departmentId).ToListAsync();
        foreach (var room in rooms)
        {
            room.DepartmentId = null; // Assuming nullable foreign key
        }

        await _context.SaveChangesAsync();
    }

    private void ValidateDepartmentDto(DepartmentDto departmentDto)
    {
        if (string.IsNullOrWhiteSpace(departmentDto.Name))
        {
            throw new ArgumentException("Department name is required.");
        }
    }
}
