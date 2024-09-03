using AutoMapper;
using backend.Core.DbContext;
using Microsoft.EntityFrameworkCore;

namespace backend.Core.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public AppointmentService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<AppointmentDto> GetAppointmentByIdAsync(int appointmentId)
        {
            var appointment = await _context.Appointments
                .AsNoTracking() // Use AsNoTracking for read-only queries
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .Include(a => a.Room)
                .FirstOrDefaultAsync(a => a.Id == appointmentId);

            if (appointment == null)
            {
                throw new ArgumentException($"Appointment with ID {appointmentId} not found.");
            }

            return _mapper.Map<AppointmentDto>(appointment);
        }

        public async Task<IEnumerable<AppointmentDto>> GetAllAppointmentsAsync()
        {
            var appointments = await _context.Appointments
                .AsNoTracking() // Use AsNoTracking for read-only queries
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .Include(a => a.Room)
                .ToListAsync();

            return _mapper.Map<IEnumerable<AppointmentDto>>(appointments);
        }

        public async Task CreateAppointmentAsync(AppointmentDto appointmentDto)
        {
            // Validate appointment date
            if (appointmentDto.AppointmentDate < DateTime.UtcNow)
            {
                throw new ArgumentException("Appointment date cannot be in the past.");
            }

            // Validate related entities
            var patient = await _context.Patients.FindAsync(appointmentDto.PatientId);
            var doctor = await _context.Doctors.FindAsync(appointmentDto.DoctorId);
            var room = await _context.Rooms.FindAsync(appointmentDto.RoomId);

            if (patient == null)
            {
                throw new ArgumentException($"Patient with ID {appointmentDto.PatientId} not found.");
            }

            if (doctor == null)
            {
                throw new ArgumentException($"Doctor with ID {appointmentDto.DoctorId} not found.");
            }

            if (room == null)
            {
                throw new ArgumentException($"Room with ID {appointmentDto.RoomId} not found.");
            }

            var appointment = _mapper.Map<Appointment>(appointmentDto);
            appointment.Patient = patient;
            appointment.Doctor = doctor;
            appointment.Room = room;

            await _context.Appointments.AddAsync(appointment);
            await _context.SaveChangesAsync();

            appointmentDto.Id = appointment.Id;
        }

        public async Task UpdateAppointmentAsync(int appointmentId, AppointmentDto appointmentDto)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .Include(a => a.Room)
                .FirstOrDefaultAsync(a => a.Id == appointmentId);

            if (appointment == null)
            {
                throw new ArgumentException($"Appointment with ID {appointmentId} not found.");
            }

            // Validate appointment date
            if (appointmentDto.AppointmentDate < DateTime.UtcNow)
            {
                throw new ArgumentException("Appointment date cannot be in the past.");
            }

            // Validate related entities
            var patient = await _context.Patients.FindAsync(appointmentDto.PatientId);
            var doctor = await _context.Doctors.FindAsync(appointmentDto.DoctorId);
            var room = await _context.Rooms.FindAsync(appointmentDto.RoomId);

            if (patient == null)
            {
                throw new ArgumentException($"Patient with ID {appointmentDto.PatientId} not found.");
            }

            if (doctor == null)
            {
                throw new ArgumentException($"Doctor with ID {appointmentDto.DoctorId} not found.");
            }

            if (room == null)
            {
                throw new ArgumentException($"Room with ID {appointmentDto.RoomId} not found.");
            }

            _mapper.Map(appointmentDto, appointment);
            appointment.Patient = patient;
            appointment.Doctor = doctor;
            appointment.Room = room;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAppointmentAsync(int appointmentId)
        {
            var appointment = await _context.Appointments.FindAsync(appointmentId);
            if (appointment == null)
            {
                throw new ArgumentException($"Appointment with ID {appointmentId} not found.");
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
        }
    }
}
