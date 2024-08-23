using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Core.DbContext;
using backend.Core.Dtos.General;
using backend.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Core.Services
{
    public class NurseService : INurseService
    {
        private readonly ApplicationDbContext _context;

        public NurseService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<NurseDto> GetNurseByIdAsync(int nurseId)
        {
            var nurse = await _context.Nurses.FindAsync(nurseId);
            if (nurse == null) return null;

            return new NurseDto
            {
                Id = nurse.Id,
                FirstName = nurse.FirstName,
                LastName = nurse.LastName,
                Gender = nurse.Gender,
                ContactInfo = nurse.ContactInfo,
                DateOfBirth = nurse.DateOfBirth,
                DateHired = nurse.DateHired,
                Department = nurse.Department,
                Qualifications = nurse.Qualifications,
                IsAvailable = nurse.IsAvailable
            };
        }

        public async Task<IEnumerable<NurseDto>> GetAllNursesAsync()
        {
            return await _context.Nurses
                .Select(nurse => new NurseDto
                {
                    Id = nurse.Id,
                    FirstName = nurse.FirstName,
                    LastName = nurse.LastName,
                    Gender = nurse.Gender,
                    ContactInfo = nurse.ContactInfo,
                    DateOfBirth = nurse.DateOfBirth,
                    DateHired = nurse.DateHired,
                    Department = nurse.Department,
                    Qualifications = nurse.Qualifications,
                    IsAvailable = nurse.IsAvailable
                })
                .ToListAsync();
        }

        public async Task CreateNurseAsync(NurseDto nurseDto)
        {
            var nurse = new Nurse
            {
                FirstName = nurseDto.FirstName,
                LastName = nurseDto.LastName,
                Gender = nurseDto.Gender,
                ContactInfo = nurseDto.ContactInfo,
                DateOfBirth = nurseDto.DateOfBirth,
                DateHired = nurseDto.DateHired,
                Department = nurseDto.Department,
                Qualifications = nurseDto.Qualifications,
                IsAvailable = nurseDto.IsAvailable
            };

            await _context.Nurses.AddAsync(nurse);
            await _context.SaveChangesAsync();

            nurseDto.Id = nurse.Id;
        }

        public async Task UpdateNurseAsync(int nurseId, NurseDto nurseDto)
        {
            var nurse = await _context.Nurses.FindAsync(nurseId);
            if (nurse == null) return;

            nurse.FirstName = nurseDto.FirstName;
            nurse.LastName = nurseDto.LastName;
            nurse.Gender = nurseDto.Gender;
            nurse.ContactInfo = nurseDto.ContactInfo;
            nurse.DateOfBirth = nurseDto.DateOfBirth;
            nurse.DateHired = nurseDto.DateHired;
            nurse.Department = nurseDto.Department;
            nurse.Qualifications = nurseDto.Qualifications;
            nurse.IsAvailable = nurseDto.IsAvailable;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteNurseAsync(int nurseId)
        {
            var nurse = await _context.Nurses.FindAsync(nurseId);
            if (nurse == null) return;

            _context.Nurses.Remove(nurse);
            await _context.SaveChangesAsync();
        }
    }
}
