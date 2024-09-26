using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Core.Dtos.Appointment;
using backend.Core.Dtos.General;

public interface IAppointmentService
{
    Task<AppointmentDto> GetAppointmentByIdAsync(int appointmentId);
    Task<IEnumerable<AppointmentDto>> GetAllAppointmentsAsync();
    Task<IEnumerable<AppointmentDto>> GetAppointmentsByUserId(string id);
    Task<GeneralServiceResponseDto> CreateAppointmentAsync(CUAppointmentDto appointmentDto);
    Task<GeneralServiceResponseDto> UpdateAppointmentAsync(int appointmentId, CUAppointmentDto appointmentDto);
    Task DeleteAppointmentAsync(int appointmentId);
    
}
