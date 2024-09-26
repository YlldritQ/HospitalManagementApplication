using AutoMapper;
using backend.Core.DbContext;
using Microsoft.EntityFrameworkCore;
using backend.Core.Dtos.Appointment;
using backend.Core.Dtos.General;
using Microsoft.IdentityModel.Tokens;
using backend.Core.Interfaces;
using Microsoft.AspNetCore.Identity;
using backend.Core.Entities;
using backend.Core.Constants;

namespace backend.Core.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;


        public AppointmentService(ApplicationDbContext context, IMapper mapper, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
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

        public async Task<IEnumerable<AppointmentDto>> GetAppointmentsByUserId(string id)
        {
            // Get the roles of the user based on their ID
            var userRoles = await _authService.GetRolesById(id);

            if (userRoles == null)
            {
                throw new ArgumentException("No roles found for the user.");
            }

            IEnumerable<Appointment> appointments = Enumerable.Empty<Appointment>(); // Default empty collection

            // Check if the user is a patient
            if (userRoles.Contains(StaticUserRoles.PATIENT))
            {
                var patientService = new PatientService(_context, _mapper);
                var patient = await patientService.GetPatientByUserIdAsync(id);

                if (patient != null)
                {
                    // Get appointments for the patient
                    appointments = await _context.Appointments
                        .AsNoTracking() // Use AsNoTracking for read-only queries
                        .Include(a => a.Patient)
                        .Include(a => a.Doctor)
                        .Include(a => a.Room)
                        .Where(a => a.PatientId == patient.PatientId)
                        .ToListAsync();
                }
            }
            // Check if the user is a doctor
            else if (userRoles.Contains(StaticUserRoles.DOCTOR))
            {
                var doctorService = new DoctorService(_context, _mapper);
                var doctor = await doctorService.GetDoctorByUserIdAsync(id);

                if (doctor != null)
                {
                    // Get appointments for the doctor
                    appointments = await _context.Appointments
                        .AsNoTracking()
                        .Include(a => a.Patient)
                        .Include(a => a.Doctor)
                        .Include(a => a.Room)
                        .Where(a => a.DoctorId == doctor.Id)
                        .ToListAsync();
                }
            }
            else
            {
                throw new ArgumentException("The user is not authorized to view appointments.");
            }

            // If no appointments are found, throw an exception
            if (appointments == null || !appointments.Any())
            {
                throw new ArgumentException("No appointments found for the given user.");
            }

            // Map the appointments to AppointmentDto and return them
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
            var response = new GeneralServiceResponseDto();

            // Fetch the existing appointment
            var appointment = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .Include(a => a.Room)
                .FirstOrDefaultAsync(a => a.Id == appointmentId);

            // Check if the appointment exists
            if (appointment == null)
            {
                response.IsSucceed = false;
                response.StatusCode = 404;
                response.Message = "Appointment not found.";
                return response;
            }

            // Initialize error messages list
            var errorMessages = new List<string>();

            // Validate appointment date
            if (appointmentDto.AppointmentDate < DateTime.UtcNow)
            {
                errorMessages.Add("Appointment date cannot be in the past.");
            }

            // Validate related entities
            var patient = await _context.Patients.FindAsync(appointmentDto.PatientId);
            var doctor = await _context.Doctors.FindAsync(appointmentDto.DoctorId);
            var room = await _context.Rooms.FindAsync(appointmentDto.RoomId);

            if (patient == null)
            {
                errorMessages.Add($"Patient with ID {appointmentDto.PatientId} not found.");
            }

            if (doctor == null)
            {
                errorMessages.Add($"Doctor with ID {appointmentDto.DoctorId} not found.");
            }

            if (room == null)
            {
                errorMessages.Add($"Room with ID {appointmentDto.RoomId} not found.");
            }

            // If there are validation errors, return them
            if (errorMessages.Any())
            {
                response.IsSucceed = false;
                response.StatusCode = 400;
                response.Message = string.Join(" ", errorMessages);
                return response;
            }

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

            // Map the DTO to the entity and update references
            _mapper.Map(appointmentDto, appointment);
            appointment.Patient = patient;
            appointment.Doctor = doctor;
            appointment.Room = room;

            // Save changes to the database
            await _context.SaveChangesAsync();

            // Return success response
            response.IsSucceed = true;
            response.StatusCode = 200;
            response.Message = "Update saved";
            return response;
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
