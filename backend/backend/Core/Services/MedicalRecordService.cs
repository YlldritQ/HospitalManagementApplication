using AutoMapper;
using backend.Core.DbContext;
using backend.Core.Dtos.General;
using backend.Core.Dtos.Records;
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
                .Include(r => r.Doctor)
                .Include(r => r.Nurse)
                .Include(r => r.Prescription)
                .AsNoTracking()
                .ToListAsync();

            return _mapper.Map<IEnumerable<MedicalRecordDto>>(records);
        }

        public async Task<GeneralServiceResponseDto> CreateMedicalRecordAsync(CUMedicalRecordDto recordDto)
        {
            // Validate that the patient exists
            await ValidatePatientExistsAsync(recordDto.PatientId);
            if (recordDto.DoctorId.HasValue)
                await ValidateDoctorExistsAsync(recordDto.DoctorId.Value);
            if (recordDto.NurseId.HasValue)
                await ValidateNurseExistsAsync(recordDto.NurseId.Value);
            if (recordDto.PrescriptionId.HasValue)
                await ValidatePrescriptionExistsAsync(recordDto.PrescriptionId.Value);

            var record = _mapper.Map<MedicalRecord>(recordDto);

            await _context.MedicalRecords.AddAsync(record);
            await _context.SaveChangesAsync();
            return new GeneralServiceResponseDto()
            {
                IsSucceed = true,
                StatusCode = 200,
                Message = "MedicalRecord Inserted"
            };
        }

        public async Task<GeneralServiceResponseDto> UpdateMedicalRecordAsync(int recordId, CUMedicalRecordDto recordDto)
        {
            // Fetch the existing medical record from the database, including the associated patient.
            var record = await _context.MedicalRecords
                .Include(r => r.Patient) // Include patient for validation
                .Include(r => r.Doctor)
                .Include(r => r.Nurse)
                .Include(r => r.Prescription)
                .FirstOrDefaultAsync(r => r.Id == recordId);

            // Check if the record exists; if not, return a failure response.
            if (record == null)
            {
                return new GeneralServiceResponseDto
                {
                    IsSucceed = false,
                    StatusCode = 404,
                    Message = $"Medical record with ID {recordId} not found."
                };
            }

            // Validate that the patient specified in the incoming DTO exists.
            try
            {
                await ValidatePatientExistsAsync(recordDto.PatientId);
                if (recordDto.DoctorId.HasValue)
                    await ValidateDoctorExistsAsync(recordDto.DoctorId.Value);
                if (recordDto.NurseId.HasValue)
                    await ValidateNurseExistsAsync(recordDto.NurseId.Value);
                if (recordDto.PrescriptionId.HasValue)
                    await ValidatePrescriptionExistsAsync(recordDto.PrescriptionId.Value);
            }
            catch (ArgumentException ex)
            {
                return new GeneralServiceResponseDto
                {
                    IsSucceed = false,
                    StatusCode = 404,
                    Message = ex.Message
                };
            }

            // Map the incoming DTO to the existing record entity.
            _mapper.Map(recordDto, record);

            // Save the changes to the database.
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
                    Message = "An error occurred while updating the medical record."
                };
            }

            // Return a successful response.
            return new GeneralServiceResponseDto
            {
                IsSucceed = true,
                StatusCode = 200,
                Message = $"Medical record with ID {recordId} has been updated successfully."
            };
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

        private async Task ValidateDoctorExistsAsync(int doctorId)
        {
            var doctorExists = await _context.Doctors.AnyAsync(d => d.Id == doctorId);
            if (!doctorExists)
            {
                throw new ArgumentException($"Doctor with ID {doctorId} not found.");
            }
        }

        private async Task ValidateNurseExistsAsync(int nurseId)
        {
            var nurseExists = await _context.Nurses.AnyAsync(n => n.Id == nurseId);
            if (!nurseExists)
            {
                throw new ArgumentException($"Nurse with ID {nurseId} not found.");
            }
        }

        private async Task ValidatePrescriptionExistsAsync(int prescriptionId)
        {
            var prescriptionExists = await _context.Prescriptions.AnyAsync(p => p.Id == prescriptionId);
            if (!prescriptionExists)
            {
                throw new ArgumentException($"Prescription with ID {prescriptionId} not found.");
            }
        }

    }
}