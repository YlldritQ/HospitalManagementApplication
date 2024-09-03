using AutoMapper;
using backend.Core.DbContext;
using backend.Core.Dtos.General;
using backend.Core.Entities;
using backend.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Core.Services
{
    public class PatientService : IPatientService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public PatientService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PatientDto> GetPatientByIdAsync(int patientId)
        {
            var patient = await _context.Patients
                .AsNoTracking()
                .Include(p => p.Appointments)
                .Include(p => p.Prescriptions)
                .Include(p => p.MedicalRecords)
                .FirstOrDefaultAsync(p => p.PatientId == patientId);

            if (patient == null) return null;

            return _mapper.Map<PatientDto>(patient);
        }

        public async Task<IEnumerable<PatientDto>> GetAllPatientsAsync()
        {
            var patients = await _context.Patients
                .AsNoTracking()
                .ToListAsync();

            return _mapper.Map<IEnumerable<PatientDto>>(patients);
        }

        public async Task<PatientDto> CreatePatientAsync(PatientDto patientDto)
        {
            ValidatePatientDto(patientDto);

            var patient = _mapper.Map<Patient>(patientDto);

            await _context.Patients.AddAsync(patient);
            await _context.SaveChangesAsync();

            patientDto.PatientId = patient.PatientId;
            return patientDto;
        }

        public async Task UpdatePatientAsync(int patientId, PatientDto patientDto)
        {
            await ValidatePatientExistsAsync(patientId);

            var patient = await _context.Patients
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.PatientId == patientId);

            if (patient == null) return;

            patient = _mapper.Map<Patient>(patientDto);
            patient.PatientId = patientId; // Ensure the ID is set correctly

            _context.Patients.Update(patient);
            await _context.SaveChangesAsync();
        }

        public async Task DeletePatientAsync(int patientId)
        {
            var patient = await _context.Patients.FindAsync(patientId);
            if (patient == null) return;

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();
        }

        private async Task ValidatePatientExistsAsync(int patientId)
        {
            var exists = await _context.Patients.AsNoTracking().AnyAsync(p => p.PatientId == patientId);
            if (!exists)
            {
                throw new ArgumentException($"Patient with ID {patientId} not found.");
            }
        }

        private void ValidatePatientDto(PatientDto patientDto)
        {
            if (string.IsNullOrWhiteSpace(patientDto.FirstName))
            {
                throw new ArgumentException("First name is required.");
            }

            if (string.IsNullOrWhiteSpace(patientDto.LastName))
            {
                throw new ArgumentException("Last name is required.");
            }

            if (patientDto.DateOfBirth == default)
            {
                throw new ArgumentException("Date of birth is required.");
            }
        }
    }
}
