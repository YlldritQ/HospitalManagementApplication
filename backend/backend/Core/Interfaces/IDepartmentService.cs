using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Core.Dtos.General;

public interface IDepartmentService
{
    Task<DepartmentDto> GetDepartmentByIdAsync(int departmentId);
    Task<IEnumerable<DepartmentDto>> GetAllDepartmentsAsync();
    Task CreateDepartmentAsync(DepartmentDto departmentDto);
    Task UpdateDepartmentAsync(int departmentId, DepartmentDto departmentDto);
    Task DeleteDepartmentAsync(int departmentId);
}

