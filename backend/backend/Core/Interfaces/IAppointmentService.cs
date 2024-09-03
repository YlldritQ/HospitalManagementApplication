using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Core.Dtos.General;

public interface IAppointmentService
{
    Task<AppointmentDto> GetAppointmentByIdAsync(int appointmentId);
    Task<IEnumerable<AppointmentDto>> GetAllAppointmentsAsync();
    Task CreateAppointmentAsync(AppointmentDto appointmentDto);
    Task UpdateAppointmentAsync(int appointmentId, AppointmentDto appointmentDto);
    Task DeleteAppointmentAsync(int appointmentId);
    
}
