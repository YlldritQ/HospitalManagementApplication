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
    Task AddDoctorsToDepartmentAsync(int departmentId, IEnumerable<int> doctorIds);
    Task AddNursesToDepartmentAsync(int departmentId, IEnumerable<int> nurseIds);
    Task RemoveDoctorsFromDepartmentAsync(int departmentId, IEnumerable<int> doctorIds);
    Task RemoveNursesFromDepartmentAsync(int departmentId, IEnumerable<int> nurseIds);
    Task AddRoomsToDepartmentAsync(int departmentId, IEnumerable<int> roomIds);
    Task RemoveRoomsFromDepartmentAsync(int departmentId, IEnumerable<int> roomIds);

}

