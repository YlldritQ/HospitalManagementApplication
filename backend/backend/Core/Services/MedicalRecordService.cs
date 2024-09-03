using AutoMapper;
using backend.Core.DbContext;
using backend.Core.Dtos.General;
using backend.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Core.Services
{
    public class MedicalRecordService : IMedicalRecordService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public MedicalRecordService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<MedicalRecordDto> GetMedicalRecordByIdAsync(int recordId)
        {
            var record = await _context.MedicalRecords
                .Include(r => r.Patient) // Include patient for detailed DTO
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.Id == recordId);

            if (record == null)
            {
                throw new ArgumentException($"Medical record with ID {recordId} not found.");
            }

            return _mapper.Map<MedicalRecordDto>(record);
        }

        public async Task<IEnumerable<MedicalRecordDto>> GetAllMedicalRecordsAsync()
        {
            var records = await _context.MedicalRecords
                .Include(r => r.Patient) // Include patient for detailed DTO
                .AsNoTracking()
                .ToListAsync();

            return _mapper.Map<IEnumerable<MedicalRecordDto>>(records);
        }

        public async Task CreateMedicalRecordAsync(MedicalRecordDto recordDto)
        {
            // Validate that the patient exists
            await ValidatePatientExistsAsync(recordDto.PatientId);

            var record = _mapper.Map<MedicalRecord>(recordDto);

            await _context.MedicalRecords.AddAsync(record);
            await _context.SaveChangesAsync();

            recordDto.Id = record.Id;
        }

        public async Task UpdateMedicalRecordAsync(int recordId, MedicalRecordDto recordDto)
        {
            var record = await _context.MedicalRecords
                .Include(r => r.Patient) // Include patient for validation
                .FirstOrDefaultAsync(r => r.Id == recordId);

            if (record == null)
            {
                throw new ArgumentException($"Medical record with ID {recordId} not found.");
            }

            // Validate that the patient exists
            await ValidatePatientExistsAsync(recordDto.PatientId);

            _mapper.Map(recordDto, record);

            await _context.SaveChangesAsync();
        }

        public async Task DeleteMedicalRecordAsync(int recordId)
        {
            var record = await _context.MedicalRecords.FindAsync(recordId);

            if (record == null)
            {
                throw new ArgumentException($"Medical record with ID {recordId} not found.");
            }

            _context.MedicalRecords.Remove(record);
            await _context.SaveChangesAsync();
        }

        private async Task ValidatePatientExistsAsync(int patientId)
        {
            var patientExists = await _context.Patients.AnyAsync(p => p.PatientId == patientId);
            if (!patientExists)
            {
                throw new ArgumentException($"Patient with ID {patientId} not found.");
            }
        }
    }
}
