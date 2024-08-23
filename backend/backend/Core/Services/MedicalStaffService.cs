using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Core.DbContext;
using backend.Core.Dtos.General;
using backend.Core.Entities;
using Microsoft.EntityFrameworkCore;

public class MedicalStaffService : IMedicalStaffService
{
    private readonly ApplicationDbContext _context;

    public MedicalStaffService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<MedicalStaffDto> GetMedicalStaffByIdAsync(int staffId)
    {
        var staff = await _context.Doctors
            .Where(d => d.Id == staffId)
            .Select(d => new MedicalStaffDto
            {
                Id = d.Id,
                FirstName = d.FirstName,
                LastName = d.LastName,
                Gender = d.Gender,
                ContactInfo = d.ContactInfo,
                DateOfBirth = d.DateOfBirth,
                DateHired = d.DateHired
            })
            .FirstOrDefaultAsync();

        if (staff == null)
        {
            staff = await _context.Nurses
                .Where(n => n.Id == staffId)
                .Select(n => new MedicalStaffDto
                {
                    Id = n.Id,
                    FirstName = n.FirstName,
                    LastName = n.LastName,
                    Gender = n.Gender,
                    ContactInfo = n.ContactInfo,
                    DateOfBirth = n.DateOfBirth,
                    DateHired = n.DateHired
                })
                .FirstOrDefaultAsync();
        }

        return staff;
    }

    public async Task<IEnumerable<MedicalStaffDto>> GetAllMedicalStaffAsync()
    {
        var doctors = await _context.Doctors
            .Select(d => new MedicalStaffDto
            {
                Id = d.Id,
                FirstName = d.FirstName,
                LastName = d.LastName,
                Gender = d.Gender,
                ContactInfo = d.ContactInfo,
                DateOfBirth = d.DateOfBirth,
                DateHired = d.DateHired
            })
            .ToListAsync();

        var nurses = await _context.Nurses
            .Select(n => new MedicalStaffDto
            {
                Id = n.Id,
                FirstName = n.FirstName,
                LastName = n.LastName,
                Gender = n.Gender,
                ContactInfo = n.ContactInfo,
                DateOfBirth = n.DateOfBirth,
                DateHired = n.DateHired
            })
            .ToListAsync();

        return doctors.Concat(nurses);
    }

    public async Task UpdateMedicalStaffAsync(int staffId, MedicalStaffDto staffDto)
    {
        var doctor = await _context.Doctors.FindAsync(staffId);
        if (doctor != null)
        {
            doctor.FirstName = staffDto.FirstName;
            doctor.LastName = staffDto.LastName;
            doctor.Gender = staffDto.Gender;
            doctor.ContactInfo = staffDto.ContactInfo;
            doctor.DateOfBirth = staffDto.DateOfBirth;
            doctor.DateHired = staffDto.DateHired;
            await _context.SaveChangesAsync();
            return;
        }

        var nurse = await _context.Nurses.FindAsync(staffId);
        if (nurse != null)
        {
            nurse.FirstName = staffDto.FirstName;
            nurse.LastName = staffDto.LastName;
            nurse.Gender = staffDto.Gender;
            nurse.ContactInfo = staffDto.ContactInfo;
            nurse.DateOfBirth = staffDto.DateOfBirth;
            nurse.DateHired = staffDto.DateHired;
            await _context.SaveChangesAsync();
        }
    }
}
