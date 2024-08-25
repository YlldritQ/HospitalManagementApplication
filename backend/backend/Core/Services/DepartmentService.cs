using backend.Core.DbContext;
using backend.Core.Dtos.General;
using backend.Core.Entities;
using Microsoft.EntityFrameworkCore;

public class DepartmentService : IDepartmentService
{
    private readonly ApplicationDbContext _context;

    public DepartmentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DepartmentDto> GetDepartmentByIdAsync(int departmentId)
    {
        var department = await _context.Departments.FindAsync(departmentId);
        if (department == null) return null;

        return new DepartmentDto
        {
            Id = department.Id,
            Name = department.Name,
            Description = department.Description
        };
    }

    public async Task<IEnumerable<DepartmentDto>> GetAllDepartmentsAsync()
    {
        return await _context.Departments
            .Select(department => new DepartmentDto
            {
                Id = department.Id,
                Name = department.Name,
                Description = department.Description
            })
            .ToListAsync();
    }

    public async Task CreateDepartmentAsync(DepartmentDto departmentDto)
    {
        var department = new Department
        {
            Name = departmentDto.Name,
            Description = departmentDto.Description
        };

        await _context.Departments.AddAsync(department);
        await _context.SaveChangesAsync();

        departmentDto.Id = department.Id;
    }

    public async Task UpdateDepartmentAsync(int departmentId, DepartmentDto departmentDto)
    {
        var department = await _context.Departments.FindAsync(departmentId);
        if (department == null) return;

        department.Name = departmentDto.Name;
        department.Description = departmentDto.Description;

        await _context.SaveChangesAsync();
    }

    public async Task DeleteDepartmentAsync(int departmentId)
    {
        var department = await _context.Departments.FindAsync(departmentId);
        if (department == null) return;

        _context.Departments.Remove(department);
        await _context.SaveChangesAsync();
    }
}
