using backend.Core.DbContext;
using backend.Core.Dtos.General;
using backend.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Core.Services
{
    public class MedicalRecordService : IMedicalRecordService
    {
        private readonly ApplicationDbContext _context;

        public MedicalRecordService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<MedicalRecordDto> GetMedicalRecordByIdAsync(int recordId)
        {
            var record = await _context.MedicalRecords
                .Include(r => r.Patient)
                .FirstOrDefaultAsync(r => r.Id == recordId);

            if (record == null) return null;

            return new MedicalRecordDto
            {
                Id = record.Id,
                PatientId = record.PatientId,
                RecordDate = record.RecordDate,
                RecordDetails = record.RecordDetails
            };
        }

        public async Task<IEnumerable<MedicalRecordDto>> GetAllMedicalRecordsAsync()
        {
            return await _context.MedicalRecords
                .Include(r => r.Patient)
                .Select(record => new MedicalRecordDto
                {
                    Id = record.Id,
                    PatientId = record.PatientId,
                    RecordDate = record.RecordDate,
                    RecordDetails = record.RecordDetails
                })
                .ToListAsync();
        }

        public async Task CreateMedicalRecordAsync(MedicalRecordDto recordDto)
        {
            var record = new MedicalRecord
            {
                PatientId = recordDto.PatientId,
                RecordDate = recordDto.RecordDate,
                RecordDetails = recordDto.RecordDetails
            };

            await _context.MedicalRecords.AddAsync(record);
            await _context.SaveChangesAsync();

            recordDto.Id = record.Id;
        }

        public async Task UpdateMedicalRecordAsync(int recordId, MedicalRecordDto recordDto)
        {
            var record = await _context.MedicalRecords.FindAsync(recordId);
            if (record == null) return;

            record.PatientId = recordDto.PatientId;
            record.RecordDate = recordDto.RecordDate;
            record.RecordDetails = recordDto.RecordDetails;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteMedicalRecordAsync(int recordId)
        {
            var record = await _context.MedicalRecords.FindAsync(recordId);
            if (record == null) return;

            _context.MedicalRecords.Remove(record);
            await _context.SaveChangesAsync();
        }
    }
}
