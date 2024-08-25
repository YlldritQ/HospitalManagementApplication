using backend.Core.DbContext;
using backend.Core.Dtos.General;
using backend.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Core.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly ApplicationDbContext _context;

        public AppointmentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AppointmentDto> GetAppointmentByIdAsync(int appointmentId)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .FirstOrDefaultAsync(a => a.Id == appointmentId);

            if (appointment == null) return null;

            return new AppointmentDto
            {
                Id = appointment.Id,
                AppointmentDate = appointment.AppointmentDate,
                PatientId = appointment.PatientId, // Use PatientId here
                DoctorId = appointment.DoctorId,
                Status = appointment.Status
            };
        }

        public async Task<IEnumerable<AppointmentDto>> GetAllAppointmentsAsync()
        {
            return await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .Select(a => new AppointmentDto
                {
                    Id = a.Id,
                    AppointmentDate = a.AppointmentDate,
                    PatientId = a.Patient.PatientId,
                    DoctorId = a.Doctor.Id,
                    Status = a.Status
                })
                .ToListAsync();
        }

        public async Task CreateAppointmentAsync(AppointmentDto appointmentDto)
        {
            var patient = await _context.Patients.FindAsync(appointmentDto.PatientId);
            var doctor = await _context.Doctors.FindAsync(appointmentDto.DoctorId);

            if (patient == null || doctor == null) return;

            var appointment = new Appointment
            {
                AppointmentDate = appointmentDto.AppointmentDate,
                Patient = patient,
                Doctor = doctor,
                Status = appointmentDto.Status
            };

            await _context.Appointments.AddAsync(appointment);
            await _context.SaveChangesAsync();

            appointmentDto.Id = appointment.Id;
        }

        public async Task UpdateAppointmentAsync(int appointmentId, AppointmentDto appointmentDto)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .FirstOrDefaultAsync(a => a.Id == appointmentId);

            if (appointment == null) return;

            var patient = await _context.Patients.FindAsync(appointmentDto.PatientId);
            var doctor = await _context.Doctors.FindAsync(appointmentDto.DoctorId);

            if (patient == null || doctor == null) return;

            appointment.AppointmentDate = appointmentDto.AppointmentDate;
            appointment.Patient = patient;
            appointment.Doctor = doctor;
            appointment.Status = appointmentDto.Status;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAppointmentAsync(int appointmentId)
        {
            var appointment = await _context.Appointments.FindAsync(appointmentId);
            if (appointment == null) return;

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
        }
    }
}
