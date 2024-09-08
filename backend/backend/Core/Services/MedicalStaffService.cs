using AutoMapper;
using backend.Core.DbContext;
using backend.Core.Dtos.General;
using backend.Core.Dtos.Staff;
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

        public async Task<GeneralServiceResponseDto> UpdateMedicalStaffAsync(int staffId, MedicalStaffDto staffDto)
        {
            // Check for doctor and nurse in a single query using Union
            var staff = await _context.Doctors
                .Where(d => d.Id == staffId)
                .Cast<MedicalStaff>()
                .Union(_context.Nurses.Where(n => n.Id == staffId).Cast<MedicalStaff>())
                .FirstOrDefaultAsync();

            // If the staff member is not found, return a response indicating failure.
            if (staff == null)
            {
                return new GeneralServiceResponseDto
                {
                    IsSucceed = false,
                    StatusCode = 404,
                    Message = $"Staff member with ID {staffId} not found."
                };
            }

            // Update the staff details using AutoMapper
            _mapper.Map(staffDto, staff);

            // Save the changes to the database
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                // Handle exceptions related to the database update and return a failure response.
                return new GeneralServiceResponseDto
                {
                    IsSucceed = false,
                    StatusCode = 500,
                    Message = "An error occurred while updating the staff member."
                };
            }

            // Return a successful response if everything went well.
            return new GeneralServiceResponseDto
            {
                IsSucceed = true,
                StatusCode = 200,
                Message = $"Staff member with ID {staffId} has been updated successfully."
            };
        }

    }
}
