using AutoMapper;
using backend.Core.DbContext;
using backend.Core.Dtos.General;
using backend.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Core.Services
{
    public class MedicalStaffService : IMedicalStaffService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public MedicalStaffService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<MedicalStaffDto> GetMedicalStaffByIdAsync(int staffId)
        {
            // Use a single query to fetch either doctor or nurse
            var staff = await _context.Doctors
                .Where(d => d.Id == staffId)
                .Cast<MedicalStaff>()
                .Union(_context.Nurses.Where(n => n.Id == staffId).Cast<MedicalStaff>())
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (staff == null)
            {
                return null;
            }

            return _mapper.Map<MedicalStaffDto>(staff);
        }

        public async Task<IEnumerable<MedicalStaffDto>> GetAllMedicalStaffAsync()
        {
            var doctors = await _context.Doctors.AsNoTracking().ToListAsync();
            var nurses = await _context.Nurses.AsNoTracking().ToListAsync();

            var allStaff = doctors.Cast<MedicalStaff>()
                .Concat(nurses.Cast<MedicalStaff>());

            return _mapper.Map<IEnumerable<MedicalStaffDto>>(allStaff);
        }

        public async Task UpdateMedicalStaffAsync(int staffId, MedicalStaffDto staffDto)
        {
            // Check for doctor and nurse in a single method
            var staff = await _context.Doctors
                .Where(d => d.Id == staffId)
                .Cast<MedicalStaff>()
                .Union(_context.Nurses.Where(n => n.Id == staffId).Cast<MedicalStaff>())
                .FirstOrDefaultAsync();

            if (staff == null)
            {
                throw new ArgumentException($"Staff member with ID {staffId} not found.");
            }

            // Update the staff details
            _mapper.Map(staffDto, staff);

            await _context.SaveChangesAsync();
        }
    }
}
