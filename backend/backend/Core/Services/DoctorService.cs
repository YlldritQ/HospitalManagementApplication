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
    public class DoctorService : IDoctorService
    {
        private readonly ApplicationDbContext _context;

        public DoctorService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DoctorDto> GetDoctorByIdAsync(int doctorId)
        {
            var doctor = await _context.Doctors.FindAsync(doctorId);
            if (doctor == null) return null;

            return new DoctorDto
            {
                DoctorId = doctor.DoctorId,
                FirstName = doctor.FirstName,
                LastName = doctor.LastName,
                Specialty = doctor.Specialty,
                Qualifications = doctor.Qualifications,
                ContactInfo = doctor.ContactInfo,
                IsAvailable = doctor.IsAvailable
            };
        }

        public async Task<IEnumerable<DoctorDto>> GetAllDoctorsAsync()
        {
            return await _context.Doctors
                .Select(doctor => new DoctorDto
                {
                    DoctorId = doctor.DoctorId,
                    FirstName = doctor.FirstName,
                    LastName = doctor.LastName,
                    Specialty = doctor.Specialty,
                    Qualifications = doctor.Qualifications,
                    ContactInfo = doctor.ContactInfo,
                    IsAvailable = doctor.IsAvailable
                })
                .ToListAsync();
        }

        public async Task<DoctorDto> CreateDoctorAsync(DoctorDto doctorDto)
        {
            var doctor = new Doctor
            {
                FirstName = doctorDto.FirstName,
                LastName = doctorDto.LastName,
                Specialty = doctorDto.Specialty,
                Qualifications = doctorDto.Qualifications,
                ContactInfo = doctorDto.ContactInfo,
                IsAvailable = doctorDto.IsAvailable
            };

            await _context.Doctors.AddAsync(doctor);
            await _context.SaveChangesAsync();

            doctorDto.DoctorId = doctor.DoctorId;
            return doctorDto;
        }

        public async Task UpdateDoctorAsync(int doctorId, DoctorDto doctorDto)
        {
            var doctor = await _context.Doctors.FindAsync(doctorId);
            if (doctor == null) return;

            doctor.FirstName = doctorDto.FirstName;
            doctor.LastName = doctorDto.LastName;
            doctor.Specialty = doctorDto.Specialty;
            doctor.Qualifications = doctorDto.Qualifications;
            doctor.ContactInfo = doctorDto.ContactInfo;
            doctor.IsAvailable = doctorDto.IsAvailable;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteDoctorAsync(int doctorId)
        {
            var doctor = await _context.Doctors.FindAsync(doctorId);
            if (doctor == null) return;

            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();
        }
    }
}
