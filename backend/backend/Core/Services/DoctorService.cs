using backend.Core.DbContext;
using backend.Core.Dtos.General;
using backend.Core.Entities;
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
                Id = doctor.Id,
                FirstName = doctor.FirstName,
                LastName = doctor.LastName,
                Gender = doctor.Gender,
                ContactInfo = doctor.ContactInfo,
                DateOfBirth = doctor.DateOfBirth,
                DateHired = doctor.DateHired,
                Specialty = doctor.Specialty,
                Qualifications = doctor.Qualifications,
                IsAvailable = doctor.IsAvailable
            };
        }

        public async Task<IEnumerable<DoctorDto>> GetAllDoctorsAsync()
        {
            return await _context.Doctors
                .Select(doctor => new DoctorDto
                {
                    Id = doctor.Id,
                    FirstName = doctor.FirstName,
                    LastName = doctor.LastName,
                    Gender = doctor.Gender,
                    ContactInfo = doctor.ContactInfo,
                    DateOfBirth = doctor.DateOfBirth,
                    DateHired = doctor.DateHired,
                    Specialty = doctor.Specialty,
                    Qualifications = doctor.Qualifications,
                    IsAvailable = doctor.IsAvailable
                })
                .ToListAsync();
        }

        public async Task CreateDoctorAsync(DoctorDto doctorDto)
        {
            var doctor = new Doctor
            {
                FirstName = doctorDto.FirstName,
                LastName = doctorDto.LastName,
                Gender = doctorDto.Gender,
                ContactInfo = doctorDto.ContactInfo,
                DateOfBirth = doctorDto.DateOfBirth,
                DateHired = doctorDto.DateHired,
                Specialty = doctorDto.Specialty,
                Qualifications = doctorDto.Qualifications,
                IsAvailable = doctorDto.IsAvailable
            };

            await _context.Doctors.AddAsync(doctor);
            await _context.SaveChangesAsync();

            doctorDto.Id = doctor.Id;
        }

        public async Task UpdateDoctorAsync(int doctorId, DoctorDto doctorDto)
        {
            var doctor = await _context.Doctors.FindAsync(doctorId);
            if (doctor == null) return;

            doctor.FirstName = doctorDto.FirstName;
            doctor.LastName = doctorDto.LastName;
            doctor.Gender = doctorDto.Gender;
            doctor.ContactInfo = doctorDto.ContactInfo;
            doctor.DateOfBirth = doctorDto.DateOfBirth;
            doctor.DateHired = doctorDto.DateHired;
            doctor.Specialty = doctorDto.Specialty;
            doctor.Qualifications = doctorDto.Qualifications;
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
