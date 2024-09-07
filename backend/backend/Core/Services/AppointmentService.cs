using AutoMapper;
using backend.Core.DbContext;
using Microsoft.EntityFrameworkCore;
using backend.Core.Dtos.Appointment;
using backend.Core.Dtos.General;

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

        public async Task<GeneralServiceResponseDto> CreateAppointmentAsync(CUAppointmentDto appointmentDto)
        {
            // Validate appointment date
            if (appointmentDto.AppointmentDate < DateTime.UtcNow)
            {
                return new GeneralServiceResponseDto
                {
                    IsSucceed = false,
                    StatusCode = 400,
                    Message = "Appointment date cannot be in the past."
                };
            }

            // Validate related entities
            var patient = await _context.Patients.FindAsync(appointmentDto.PatientId);
            var doctor = await _context.Doctors.FindAsync(appointmentDto.DoctorId);
            var room = await _context.Rooms.FindAsync(appointmentDto.RoomId);

            if (patient == null)
            {
                return new GeneralServiceResponseDto
                {
                    IsSucceed = false,
                    StatusCode = 404,
                    Message = $"Patient with ID {appointmentDto.PatientId} not found."
                };
            }

            if (doctor == null)
            {
                return new GeneralServiceResponseDto
                {
                    IsSucceed = false,
                    StatusCode = 404,
                    Message = $"Doctor with ID {appointmentDto.DoctorId} not found."
                };
            }

            if (room == null)
            {
                return new GeneralServiceResponseDto
                {
                    IsSucceed = false,
                    StatusCode = 404,
                    Message = $"Room with ID {appointmentDto.RoomId} not found."
                };
            }

            // Assuming the appointment lasts 30 minutes
            TimeSpan appointmentDuration = TimeSpan.FromMinutes(30);
            TimeSpan bufferPeriod = TimeSpan.FromMinutes(30); // 30 minutes buffer period

            DateTime appointmentEnd = appointmentDto.AppointmentDate.Add(appointmentDuration);

            // Fetch potential conflicting appointments from the database
            var possibleConflicts = await _context.Appointments
                .Where(a => a.DoctorId == appointmentDto.DoctorId)
                .ToListAsync(); // Fetch into memory to handle complex time logic in-memory

            // Now check for time conflicts in-memory
            bool conflictExists = possibleConflicts.Any(a =>
                (a.AppointmentDate < appointmentEnd && a.AppointmentDate.Add(appointmentDuration) > appointmentDto.AppointmentDate) ||
                (appointmentDto.AppointmentDate <= a.AppointmentDate && appointmentDto.AppointmentDate >= a.AppointmentDate.Subtract(bufferPeriod))
            );

            if (conflictExists)
            {
                return new GeneralServiceResponseDto
                {
                    IsSucceed = false,
                    StatusCode = 409,
                    Message = "An appointment already exists in the specified time window or too close to an existing appointment."
                };
            }

            // Map the DTO to the entity
            var appointment = _mapper.Map<Appointment>(appointmentDto);
            appointment.Patient = patient;
            appointment.Doctor = doctor;
            appointment.Room = room;

            // Save the new appointment
            await _context.Appointments.AddAsync(appointment);
            await _context.SaveChangesAsync();

            return new GeneralServiceResponseDto
            {
                IsSucceed = true,
                StatusCode = 201,
                Message = "Appointment created successfully."
            };
        }



        public async Task<GeneralServiceResponseDto> UpdateAppointmentAsync(int appointmentId, CUAppointmentDto appointmentDto)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .Include(a => a.Room)
                .FirstOrDefaultAsync(a => a.Id == appointmentId);

            if (appointment == null)
            {
                return new GeneralServiceResponseDto() { IsSucceed = false , StatusCode = 400, };
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
            return new GeneralServiceResponseDto() { 
                IsSucceed = true,
                StatusCode = 201,
                Message = "Update saved"
            };
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
