using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        public PatientService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PatientDto> GetPatientByIdAsync(int patientId)
        {
            var patient = await _context.Patients.FindAsync(patientId);
            if (patient == null) return null;

            return new PatientDto
            {
                PatientId = patient.PatientId,
                FirstName = patient.FirstName,
                LastName = patient.LastName,
                DateOfBirth = patient.DateOfBirth,
                Gender = patient.Gender,
                ContactInfo = patient.ContactInfo
            };
        }

        public async Task<IEnumerable<PatientDto>> GetAllPatientsAsync()
        {
            return await _context.Patients
                .Select(patient => new PatientDto
                {
                    PatientId = patient.PatientId,
                    FirstName = patient.FirstName,
                    LastName = patient.LastName,
                    DateOfBirth = patient.DateOfBirth,
                    Gender = patient.Gender,
                    ContactInfo = patient.ContactInfo
                })
                .ToListAsync();
        }

        public async Task<PatientDto> CreatePatientAsync(PatientDto patientDto)
        {
            var patient = new Patient
            {
                FirstName = patientDto.FirstName,
                LastName = patientDto.LastName,
                DateOfBirth = patientDto.DateOfBirth,
                Gender = patientDto.Gender,
                ContactInfo = patientDto.ContactInfo
            };

            await _context.Patients.AddAsync(patient);
            await _context.SaveChangesAsync();

            patientDto.PatientId = patient.PatientId;
            return patientDto;
        }

        public async Task UpdatePatientAsync(int patientId, PatientDto patientDto)
        {
            var patient = await _context.Patients.FindAsync(patientId);
            if (patient == null) return;

            patient.FirstName = patientDto.FirstName;
            patient.LastName = patientDto.LastName;
            patient.DateOfBirth = patientDto.DateOfBirth;
            patient.Gender = patientDto.Gender;
            patient.ContactInfo = patientDto.ContactInfo;

            await _context.SaveChangesAsync();
        }

        public async Task DeletePatientAsync(int patientId)
        {
            var patient = await _context.Patients.FindAsync(patientId);
            if (patient == null) return;

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();
        }
    }
}
